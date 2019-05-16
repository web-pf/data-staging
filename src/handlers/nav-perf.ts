export const navPerfTimingHandler = (record: string) => {
  const performanceTimingData = JSON.parse(record) as PerformanceNavigationTiming
  const {
    fetchStart,
    domainLookupEnd,
    domainLookupStart,
    connectStart,
    connectEnd,
    responseStart,
    responseEnd,
    domComplete,
    domInteractive,
  } = performanceTimingData

  return {
    dns: domainLookupEnd - domainLookupStart,
    tcp: connectEnd - connectStart,
    response: responseEnd - responseStart,
    dom: domInteractive - responseEnd,
    total: domComplete - fetchStart,
  }
}
