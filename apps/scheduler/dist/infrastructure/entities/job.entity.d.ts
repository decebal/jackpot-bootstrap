export declare class JobEntity {
    id: string;
    name: string;
    type: string;
    schedule: string;
    target: {
        service: string;
        method: string;
        payload: any;
    };
    status: 'active' | 'inactive' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
    last_executed_at: string;
    next_execution: string;
    result: any;
    error: string;
    metadata: Record<string, any>;
    retries: number;
    max_retries: number;
    timeout: number;
}
