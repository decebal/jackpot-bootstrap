import { Injectable, Inject } from '@nestjs/common'
import { 
	AuditLogEntry,
	GetAuditLogsResponse,
	AuditLogRepositoryInterface
} from './interfaces/admin.interface'

@Injectable()
export class AuditService {
	constructor(
		@Inject('AUDIT_LOG_REPOSITORY') private readonly auditLogRepository: AuditLogRepositoryInterface
	) {}

	async createLogEntry(
		userId: string,
		username: string,
		action: string,
		resource: string,
		resourceId?: string,
		details?: Record<string, any>,
		ip?: string,
		userAgent?: string
	): Promise<AuditLogEntry> {
		const timestamp = new Date().toISOString()
		
		return this.auditLogRepository.createLogEntry({
			userId,
			username,
			action,
			resource,
			resourceId,
			details,
			timestamp,
			ip,
			userAgent
		})
	}

	async getLogEntries(
		userId?: string,
		action?: string,
		resource?: string,
		startDate?: string,
		endDate?: string,
		limit?: number,
		offset?: number
	): Promise<GetAuditLogsResponse> {
		return this.auditLogRepository.getLogEntries(
			userId,
			action,
			resource,
			startDate,
			endDate,
			limit,
			offset
		)
	}
}
