import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from '../infrastructure/redis/redis.module'

@Module({
	imports: [
		TerminusModule,
		HttpModule,
		TypeOrmModule,
		RedisModule
	],
	controllers: [HealthController],
	providers: [HealthService],
	exports: [HealthService]
})
export class HealthModule {}
