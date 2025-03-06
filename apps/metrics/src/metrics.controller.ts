import { Controller, Logger } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { MetricsService } from './metrics.service'
import { 
  CollectMetricsRequest, 
  GetMetricsRequest, 
  GenerateReportRequest 
} from './domain/interfaces/metrics.interface'

@Controller()
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name)
  
  constructor(private readonly metricsService: MetricsService) {}

  @GrpcMethod('MetricsService', 'CollectMetrics')
  async collectMetrics(request: CollectMetricsRequest) {
    try {
      this.logger.log(`Collecting metrics from source: ${request.source}, event type: ${request.event_type}`)
      const result = await this.metricsService.collectMetrics(request)
      return { success: true, metric: result }
    } catch (error) {
      this.logger.error(`Error collecting metrics: ${error.message}`, error.stack)
      return { success: false, error: error.message }
    }
  }

  @GrpcMethod('MetricsService', 'GetMetrics')
  async getMetrics(request: GetMetricsRequest) {
    try {
      this.logger.log(`Getting metrics with filters: ${JSON.stringify(request)}`)
      const result = await this.metricsService.getMetrics(
        request.source || '',
        request.event_type || '',
        request.start_date || '',
        request.end_date || '',
        request.limit || 100,
        request.offset || 0
      )
      return { success: true, ...result }
    } catch (error) {
      this.logger.error(`Error getting metrics: ${error.message}`, error.stack)
      return { success: false, error: error.message, metrics: [], total: 0 }
    }
  }

  @GrpcMethod('MetricsService', 'GetMetricById')
  async getMetricById(request: { id: string }) {
    try {
      this.logger.log(`Getting metric by ID: ${request.id}`)
      const metric = await this.metricsService.getMetricById(request.id)
      return { success: true, metric }
    } catch (error) {
      this.logger.error(`Error getting metric by ID: ${error.message}`, error.stack)
      return { success: false, error: error.message, metric: null }
    }
  }

  @GrpcMethod('MetricsService', 'GenerateReport')
  async generateReport(request: GenerateReportRequest) {
    try {
      this.logger.log(`Generating report of type: ${request.report_type}, format: ${request.format}`)
      const report = await this.metricsService.generateReport(
        request.report_type,
        request.start_date,
        request.end_date,
        request.format
      )
      return { success: true, report }
    } catch (error) {
      this.logger.error(`Error generating report: ${error.message}`, error.stack)
      return { success: false, error: error.message, report: null }
    }
  }
}
