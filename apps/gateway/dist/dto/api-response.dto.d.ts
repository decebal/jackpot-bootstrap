export declare class EngineProcessResponse {
    success: boolean;
    id: string;
    result?: Record<string, any>;
    error?: string;
}
export declare class EngineStatusResponse {
    success: boolean;
    id: string;
    status: string;
    result?: Record<string, any>;
    error?: string;
}
export declare class HealthCheckResponse {
    status: string;
    timestamp: string;
}
