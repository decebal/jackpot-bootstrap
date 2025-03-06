import { Repository } from 'typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { AuditLogEntry, AuditLogRepositoryInterface, GetAuditLogsResponse } from '../../domain/interfaces/admin.interface';
export declare class AuditLogRepository implements AuditLogRepositoryInterface {
    private readonly auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLogEntity>);
    createLogEntry(entry: Omit<AuditLogEntry, 'id'>): Promise<AuditLogEntry>;
    getLogEntries(userId?: string, action?: string, resource?: string, startDate?: string, endDate?: string, limit?: number, offset?: number): Promise<GetAuditLogsResponse>;
    private mapEntityToDomain;
}
