import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MetricsEntity } from '../infrastructure/entities/metrics.entity'
import { RedisService } from '../infrastructure/redis/redis.service'

@Injectable()
export class HealthService {
	private readonly logger = new Logger(HealthService.name)

	constructor(
		@InjectRepository(MetricsEntity)
		private readonly metricsRepository: Repository<MetricsEntity>,
		private readonly redisService: RedisService
	) {}

	async check() {
		const status = {
			status: 'ok',
			timestamp: new Date().toISOString(),
			services: {
				database: await this.checkDatabase(),
				redis: await this.checkRedis(),
			}
		}

		// If any service is down, mark the overall status as error
		if (status.services.database.status !== 'ok' || 
			status.services.redis.status !== 'ok') {
			status.status = 'error'
		}

		return status
	}

	private async checkDatabase(): Promise<{ status: string; message?: string }> {
		try {
			// Simple query to check database connectivity
			await this.metricsRepository.query('SELECT 1')
			return { status: 'ok' }
		} catch (error) {
			this.logger.error(`Database health check failed: ${error.message}`, error.stack)
			return { 
				status: 'error', 
				message: 'Database connection failed' 
			}
		}
	}

	private async checkRedis(): Promise<{ status: string; message?: string }> {
		try {
			// Simple ping to check Redis connectivity
			const pingResult = await this.redisService.get('health:ping')
			await this.redisService.set('health:ping', 'pong', 60)
			return { status: 'ok' }
		} catch (error) {
			this.logger.error(`Redis health check failed: ${error.message}`, error.stack)
			return { 
				status: 'error', 
				message: 'Redis connection failed' 
			}
		}
	}
}
