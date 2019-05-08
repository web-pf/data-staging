export const navPerfTimingHandler = (record: string) => {
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
    domInteractive,
  } = performanceTimingData

  return {
    dnsLookUpTiming: domainLookupEnd - domainLookupStart,
    tcpTiming: connectEnd - connectStart,
    requestHandlingTiming: responseEnd - requestStart,
    domProcessingTiming: domComplete - domInteractive,
    totalRenderingTiming: domComplete - fetchStart,
  }
}
