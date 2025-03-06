import { Connection } from 'typeorm';
import { RedisService } from '../infrastructure/redis/redis.service';
export declare class HealthService {
    private readonly connection;
    private readonly redisService;
    constructor(connection: Connection, redisService: RedisService);
    check(): Promise<{
        status: string;
        services: {
            database: {
                isHealthy: boolean;
                status: string;
                error?: undefined;
            } | {
                isHealthy: boolean;
                status: string;
                error: any;
            };
            redis: {
                isHealthy: boolean;
                status: string;
                error?: undefined;
            } | {
                isHealthy: boolean;
                status: string;
                error: any;
            };
            scheduler: {
                isHealthy: boolean;
                status: string;
                activeJobs: number;
                error?: undefined;
            } | {
                isHealthy: boolean;
                status: string;
                error: any;
                activeJobs?: undefined;
            };
        };
    }>;
    private checkDatabase;
    private checkRedis;
    private checkScheduler;
}
