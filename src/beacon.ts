import koaRouter from 'koa-router'
import { saveBeacon } from './utils/beacon-utils'
import { PerformanceNodeTiming } from 'perf_hooks'

export const beacon = new koaRouter()

export interface IBeaconData {
  appId: string
  beaconName: string
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
    beaconName: 'nav_timing',
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
