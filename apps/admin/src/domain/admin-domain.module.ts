import { Module } from '@nestjs/common'
import { AdminInfrastructureModule } from '../infrastructure/admin-infrastructure.module'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { AuditService } from './audit.service'

@Module({
	imports: [AdminInfrastructureModule],
	providers: [
		UserService,
		AuthService,
		AuditService,
		{
			provide: 'USER_REPOSITORY',
			useExisting: 'USER_REPOSITORY_IMPL'
		},
		{
			provide: 'AUDIT_LOG_REPOSITORY',
			useExisting: 'AUDIT_LOG_REPOSITORY_IMPL'
		},
		{
			provide: 'AUTH_SERVICE',
			useClass: AuthService
		}
	],
	exports: [
		'USER_REPOSITORY',
		'AUDIT_LOG_REPOSITORY',
		'AUTH_SERVICE',
		UserService,
		AuthService,
		AuditService
	]
})
export class AdminDomainModule {}
