import { ProcessRequestMessage, ProcessResponseMessage, CancelResponseMessage, ProcessBatchRequestMessage, ProcessBatchResponseMessage, GetBatchStatusResponse, GetEngineConfigResponse, UpdateEngineConfigRequest, UpdateEngineConfigResponse, GetEngineStatusResponse, GetEngineMetricsRequest, GetEngineMetricsResponse } from './generated/engine';
export interface ProcessingOptions {
    priority?: number;
    timeout?: number;
    callback_url?: string;
    async?: boolean;
}
export interface EngineClientConfig {
    host: string;
    port: number;
    apiKey?: string;
    secure?: boolean;
    timeout?: number;
}
export declare class EngineClientError extends Error {
    code?: number;
    details?: string;
    metadata?: Record<string, string>;
    constructor(message: string, code?: number, details?: string, metadata?: Record<string, string>);
}
export declare class EngineClient {
    private client;
    private metadata;
    constructor(config: EngineClientConfig);
    /**
     * Process a request through the engine
     */
    processRequest(request: ProcessRequestMessage): Promise<ProcessResponseMessage>;
    /**
     * Helper method to create and process a request in one step
     */
    process(requestType: string, data: Buffer | Uint8Array | string, options?: Partial<ProcessingOptions>, metadata?: Record<string, string>): Promise<ProcessResponseMessage>;
    /**
     * Get the status of a previously submitted request
     */
    getStatus(requestId: string): Promise<ProcessResponseMessage>;
    /**
     * Cancel a request that is currently being processed
     */
    cancelRequest(requestId: string, reason?: string): Promise<CancelResponseMessage>;
    /**
     * Process a batch of requests
     */
    processBatch(request: ProcessBatchRequestMessage): Promise<ProcessBatchResponseMessage>;
    /**
     * Get the status of a batch request
     */
    getBatchStatus(batchId: string, includeResults?: boolean): Promise<GetBatchStatusResponse>;
    /**
     * Get the current engine configuration
     */
    getEngineConfig(): Promise<GetEngineConfigResponse>;
    /**
     * Update the engine configuration
     */
    updateEngineConfig(request: UpdateEngineConfigRequest): Promise<UpdateEngineConfigResponse>;
    /**
     * Get the current engine status
     */
    getEngineStatus(): Promise<GetEngineStatusResponse>;
    /**
     * Get engine metrics for a specific time range
     */
    getEngineMetrics(request: GetEngineMetricsRequest): Promise<GetEngineMetricsResponse>;
    /**
     * Close the gRPC client connection
     */
    close(): void;
}
//# sourceMappingURL=engine-client.d.ts.map