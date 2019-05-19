export const resourceTimingHandler = (record: string) => {
  const performanceTimingData = JSON.parse(record) as PerformanceResourceTiming[]

  return performanceTimingData.map((item)=> {
    const {
      duration,
      name,
      initiatorType,
      domainLookupStart,
      domainLookupEnd,
      connectEnd,
      connectStart,
      requestStart,
      responseEnd,
      responseStart,
    } = item
    return {
      duration,
      name,
      initiatorType,
      dns: domainLookupEnd - domainLookupStart,
      tcp: connectEnd - connectStart,
      request: responseStart - requestStart,
      response: responseEnd - responseStart,
    }
  })
}
