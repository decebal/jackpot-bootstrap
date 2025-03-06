import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    checkHealth(): Promise<{
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
}
