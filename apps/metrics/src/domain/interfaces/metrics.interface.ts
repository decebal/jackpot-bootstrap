// Following TypeScript implementation standards from our guide
export interface CollectMetricsRequest {
  source: string
  event_type: string
  data: unknown
  timestamp?: string
}

export interface GetMetricsRequest {
  source?: string
  event_type?: string
  start_date: string
  end_date: string
  limit?: number
  offset?: number
}

export interface GenerateReportRequest {
  report_type: string
  start_date: string
  end_date: string
  format: 'json' | 'csv'
}

export interface MetricData {
  id: string
  source: string
  event_type: string
  data: unknown
  timestamp: string
}

export interface ReportData {
  id: string
  type: string
  data: unknown
  format: string
  timestamp: string
}

// Repository interface following clean architecture principles
export interface MetricsRepositoryInterface {
  saveMetric(metric: MetricData): Promise<MetricData>
  getMetrics(
    source: string,
    eventType: string,
    startDate: string,
    endDate: string,
    limit: number,
    offset: number,
  ): Promise<{ metrics: MetricData[], total: number }>
  getMetricById(id: string): Promise<MetricData | null>
}
