import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    checkHealth(): Promise<{
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
}
