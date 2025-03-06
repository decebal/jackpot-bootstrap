export interface ProcessRequest {
    id: string;
    data: unknown;
    timestamp?: string;
}
export interface ProcessResponse {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    result: unknown;
    timestamp: string;
}
export interface IEngineRepository {
    save(data: ProcessResponse): Promise<void>;
    getStatus(id: string): Promise<ProcessResponse>;
}
