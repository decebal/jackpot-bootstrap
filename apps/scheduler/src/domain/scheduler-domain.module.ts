import { Module } from '@nestjs/common'
import { JobProcessor } from './job.processor'
import { JobValidator } from './job.validator'
import { JobScheduler } from './job.scheduler'
import { SchedulerInfrastructureModule } from '../infrastructure/scheduler-infrastructure.module'
import { GrpcModule } from '../infrastructure/grpc/grpc.module'

@Module({
	imports: [SchedulerInfrastructureModule, GrpcModule],
	providers: [JobProcessor, JobValidator, JobScheduler],
	exports: [JobProcessor, JobValidator, JobScheduler],
})
export class SchedulerDomainModule {}
