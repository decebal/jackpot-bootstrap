import { AuditLogEntry, GetAuditLogsResponse, AuditLogRepositoryInterface } from './interfaces/admin.interface';
export declare class AuditService {
    private readonly auditLogRepository;
    constructor(auditLogRepository: AuditLogRepositoryInterface);
    createLogEntry(userId: string, username: string, action: string, resource: string, resourceId?: string, details?: Record<string, any>, ip?: string, userAgent?: string): Promise<AuditLogEntry>;
    getLogEntries(userId?: string, action?: string, resource?: string, startDate?: string, endDate?: string, limit?: number, offset?: number): Promise<GetAuditLogsResponse>;
}
