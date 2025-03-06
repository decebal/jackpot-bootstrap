import { MetricsValidator } from './metrics.validator';
import { CollectMetricsRequest, MetricData } from './interfaces/metrics.interface';
export declare class MetricsProcessor {
    private readonly validator;
    constructor(validator: MetricsValidator);
    processMetrics(request: CollectMetricsRequest): Promise<MetricData>;
    private transformMetricsData;
}
