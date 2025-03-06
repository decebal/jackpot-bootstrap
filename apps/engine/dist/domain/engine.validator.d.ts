export declare class EngineValidator {
    private readonly requestSchema;
    validateRequest(data: unknown): Promise<{
        id: string;
        timestamp?: string | undefined;
        data?: any;
    }>;
}
