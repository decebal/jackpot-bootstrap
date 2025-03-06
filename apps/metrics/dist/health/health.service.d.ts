import { Repository } from 'typeorm';
import { MetricsEntity } from '../infrastructure/entities/metrics.entity';
import { RedisService } from '../infrastructure/redis/redis.service';
export declare class HealthService {
    private readonly metricsRepository;
    private readonly redisService;
    private readonly logger;
    constructor(metricsRepository: Repository<MetricsEntity>, redisService: RedisService);
    check(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: {
                status: string;
                message?: string;
            };
            redis: {
                status: string;
                message?: string;
            };
        };
    }>;
    private checkDatabase;
    private checkRedis;
}
