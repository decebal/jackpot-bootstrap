export declare class MetricsValidator {
    private readonly metricsRequestSchema;
    private readonly reportRequestSchema;
    validateMetricsRequest(data: unknown): Promise<{
        source: string;
        event_type: string;
        timestamp?: string | undefined;
        data?: any;
    }>;
    validateReportRequest(data: unknown): Promise<{
        report_type: string;
        start_date: string;
        end_date: string;
        format: "json" | "csv";
    }>;
}
