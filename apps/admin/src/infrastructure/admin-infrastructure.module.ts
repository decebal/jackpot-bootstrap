import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { AuditLogEntity } from './entities/audit-log.entity'
import { UserRepository } from './repositories/user.repository'
import { AuditLogRepository } from './repositories/audit-log.repository'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UserEntity,
			AuditLogEntity
		])
	],
	providers: [
		{
			provide: 'USER_REPOSITORY_IMPL',
			useClass: UserRepository
		},
		{
			provide: 'AUDIT_LOG_REPOSITORY_IMPL',
			useClass: AuditLogRepository
		}
	],
	exports: [
		'USER_REPOSITORY_IMPL',
		'AUDIT_LOG_REPOSITORY_IMPL'
	]
})
export class AdminInfrastructureModule {}
