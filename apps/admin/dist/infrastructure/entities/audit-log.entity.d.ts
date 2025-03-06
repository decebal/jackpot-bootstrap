export declare class AuditLogEntity {
    id: string;
    userId: string;
    username: string;
    action: string;
    resource: string;
    resourceId: string;
    details: Record<string, any>;
    timestamp: Date;
    ip: string;
    userAgent: string;
}
