import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { AuditLogEntity } from '../entities/audit-log.entity'
import { 
	AuditLogEntry, 
	AuditLogRepositoryInterface, 
	GetAuditLogsResponse 
} from '../../domain/interfaces/admin.interface'

@Injectable()
export class AuditLogRepository implements AuditLogRepositoryInterface {
	constructor(
		@InjectRepository(AuditLogEntity)
		private readonly auditLogRepository: Repository<AuditLogEntity>
	) {}

	async createLogEntry(entry: Omit<AuditLogEntry, 'id'>): Promise<AuditLogEntry> {
		const auditLogEntity = this.auditLogRepository.create({
			...entry,
			timestamp: new Date(entry.timestamp)
		})
		
		const savedLog = await this.auditLogRepository.save(auditLogEntity)
		return this.mapEntityToDomain(savedLog)
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
		const whereClause: any = {}
		
		if (userId) {
			whereClause.userId = userId
		}
		
		if (action) {
			whereClause.action = action
		}
		
		if (resource) {
			whereClause.resource = resource
		}
		
		if (startDate && endDate) {
			whereClause.timestamp = Between(new Date(startDate), new Date(endDate))
		} else if (startDate) {
			whereClause.timestamp = Between(new Date(startDate), new Date())
		} else if (endDate) {
			whereClause.timestamp = Between(new Date(0), new Date(endDate))
		}
		
		const [logs, total] = await this.auditLogRepository.findAndCount({
			where: whereClause,
			take: limit || 50,
			skip: offset || 0,
			order: {
				timestamp: 'DESC'
			}
		})
		
		return {
			logs: logs.map(log => this.mapEntityToDomain(log)),
			total
		}
	}

	private mapEntityToDomain(entity: AuditLogEntity): AuditLogEntry {
		return {
			id: entity.id,
			userId: entity.userId,
			username: entity.username,
			action: entity.action,
			resource: entity.resource,
			resourceId: entity.resourceId,
			details: entity.details,
			timestamp: entity.timestamp.toISOString(),
			ip: entity.ip,
			userAgent: entity.userAgent
		}
	}
}
