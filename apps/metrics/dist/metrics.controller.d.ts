import { MetricsService } from './metrics.service';
import { CollectMetricsRequest, GetMetricsRequest, GenerateReportRequest } from './domain/interfaces/metrics.interface';
export declare class MetricsController {
    private readonly metricsService;
    private readonly logger;
    constructor(metricsService: MetricsService);
    collectMetrics(request: CollectMetricsRequest): Promise<{
        success: boolean;
        metric: import("./domain/interfaces/metrics.interface").MetricData;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        metric?: undefined;
    }>;
    getMetrics(request: GetMetricsRequest): Promise<{
        metrics: import("./domain/interfaces/metrics.interface").MetricData[];
        total: number;
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        metrics: never[];
        total: number;
    }>;
    getMetricById(request: {
        id: string;
    }): Promise<{
        success: boolean;
        metric: import("./domain/interfaces/metrics.interface").MetricData | null;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        metric: null;
    }>;
    generateReport(request: GenerateReportRequest): Promise<{
        success: boolean;
        report: import("./domain/interfaces/metrics.interface").ReportData;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        report: null;
    }>;
}
