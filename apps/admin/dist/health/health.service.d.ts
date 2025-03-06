import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
export declare class HealthService {
    private readonly dataSource;
    private readonly redisClient;
    constructor(dataSource: DataSource, redisClient: Redis);
    check(): Promise<{
        status: string;
        services: {
            database: {
                status: string;
                message?: undefined;
            } | {
                status: string;
                message: any;
            };
            redis: {
                status: string;
                message?: undefined;
            } | {
                status: string;
                message: any;
            };
        };
    }>;
    private checkDatabase;
    private checkRedis;
}
