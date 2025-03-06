import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JobEntity } from './entities/job.entity'
import { JobRepository } from './repositories/job.repository'
import { RedisModule } from './redis/redis.module'

@Module({
	imports: [
		TypeOrmModule.forFeature([JobEntity]),
		RedisModule
	],
	providers: [JobRepository],
	exports: [JobRepository, RedisModule],
})
export class SchedulerInfrastructureModule {}
