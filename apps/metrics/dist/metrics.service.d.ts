import { MetricsRepository } from './infrastructure/repositories/metrics.repository';
import { MetricsProcessor } from './domain/metrics.processor';
import { ReportGenerator } from './domain/report.generator';
import { CollectMetricsRequest, MetricData, ReportData } from './domain/interfaces/metrics.interface';
export declare class MetricsService {
    private readonly metricsRepository;
    private readonly metricsProcessor;
    private readonly reportGenerator;
    private readonly logger;
    constructor(metricsRepository: MetricsRepository, metricsProcessor: MetricsProcessor, reportGenerator: ReportGenerator);
    collectMetrics(request: CollectMetricsRequest): Promise<MetricData>;
    getMetrics(source: string, eventType: string, startDate: string, endDate: string, limit: number, offset: number): Promise<{
        metrics: MetricData[];
        total: number;
    }>;
    getMetricById(id: string): Promise<MetricData | null>;
    generateReport(reportType: string, startDate: string, endDate: string, format: string): Promise<ReportData>;
}
