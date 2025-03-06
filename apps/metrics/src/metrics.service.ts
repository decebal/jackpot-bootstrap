import { Injectable, Logger } from '@nestjs/common'
import { MetricsRepository } from './infrastructure/repositories/metrics.repository'
import { MetricsProcessor } from './domain/metrics.processor'
import { ReportGenerator } from './domain/report.generator'
import { 
  CollectMetricsRequest, 
  MetricData, 
  ReportData 
} from './domain/interfaces/metrics.interface'

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name)
  
  constructor(
    private readonly metricsRepository: MetricsRepository,
    private readonly metricsProcessor: MetricsProcessor,
    private readonly reportGenerator: ReportGenerator,
  ) {}

  async collectMetrics(request: CollectMetricsRequest): Promise<MetricData> {
    this.logger.debug(`Processing metrics request: ${JSON.stringify(request)}`)
    // Process the metrics data using our processor (follows functional programming principles)
    const processedMetric = await this.metricsProcessor.processMetrics(request)
    
    // Save the processed metric to the repository
    return this.metricsRepository.saveMetric(processedMetric)
  }

  async getMetrics(
    source: string,
    eventType: string,
    startDate: string,
    endDate: string,
    limit: number,
    offset: number
  ): Promise<{ metrics: MetricData[], total: number }> {
    this.logger.debug(`Getting metrics with filters: source=${source}, eventType=${eventType}`)
    
    // Get metrics from repository using the provided filters
    return this.metricsRepository.getMetrics(
      source,
      eventType,
      startDate,
      endDate,
      limit,
      offset
    )
  }
  
  async getMetricById(id: string): Promise<MetricData | null> {
    this.logger.debug(`Getting metric by ID: ${id}`)
    return this.metricsRepository.getMetricById(id)
  }

  async generateReport(
    reportType: string,
    startDate: string,
    endDate: string,
    format: string
  ): Promise<ReportData> {
    this.logger.debug(`Generating report: type=${reportType}, format=${format}`)
    
    // Generate report using our report generator
    return this.reportGenerator.generateReport(
      reportType,
      startDate,
      endDate,
      format
    )
  }
}
