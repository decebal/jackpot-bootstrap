import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
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
    grpcCheck(): Promise<{
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
}
