import koaRouter from 'koa-router'
import { saveBeacon } from './utils/beacon-utils'

export const beacon = new koaRouter()

export interface IBeaconData {
  appId: string
  name: string
  record: string | object
}

beacon.post('/performance_timing', async ctx => {
  const { request } = ctx
  const { record, appId } = request.body
  const performanceTimingData = JSON.parse(record) as PerformanceTiming
  const {
    fetchStart,
    domainLookupEnd,
    domainLookupStart,
    connectStart,
    connectEnd,
    requestStart,
    responseEnd,
    domComplete,
    domLoading,
  } = performanceTimingData
  const dnsLookUpTiming = domainLookupEnd - domainLookupStart
  const tcpTiming = connectEnd - connectStart
  const requestHandlingTiming = responseEnd - requestStart
  const domProcessingTiming = domComplete - domLoading
  const totalRenderingTiming = domComplete - fetchStart

  saveBeacon({
    appId,
    name: 'nav_timing',
    record: {
      dnsLookUpTiming,
      tcpTiming,
      requestHandlingTiming,
      domProcessingTiming,
      totalRenderingTiming
    },
  })
  ctx.body = {}
})
