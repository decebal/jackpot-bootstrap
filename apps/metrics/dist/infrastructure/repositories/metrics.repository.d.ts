import { Repository } from 'typeorm';
import { MetricsEntity } from '../entities/metrics.entity';
import { MetricData, MetricsRepositoryInterface } from '../../domain/interfaces/metrics.interface';
import { RedisService } from '../redis/redis.service';
export declare class MetricsRepository implements MetricsRepositoryInterface {
    private readonly metricsRepository;
    private readonly redisService;
    private readonly CACHE_TTL;
    private readonly CACHE_PREFIX;
    constructor(metricsRepository: Repository<MetricsEntity>, redisService: RedisService);
    saveMetric(metric: MetricData): Promise<MetricData>;
    getMetrics(source: string, eventType: string, startDate: string, endDate: string, limit: number, offset: number): Promise<{
        metrics: MetricData[];
        total: number;
    }>;
    getMetricById(id: string): Promise<MetricData | null>;
    private generateCacheKey;
    private invalidateCache;
}
