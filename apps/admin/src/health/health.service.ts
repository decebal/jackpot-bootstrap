import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Redis } from 'ioredis'
import { Inject } from '@nestjs/common'

@Injectable()
export class HealthService {
	constructor(
		@InjectDataSource() private readonly dataSource: DataSource,
		@Inject('REDIS_CLIENT') private readonly redisClient: Redis
	) {}

	async check() {
		const status = {
			status: 'ok',
			services: {
				database: await this.checkDatabase(),
				redis: await this.checkRedis(),
			}
		}

		// If any service is down, mark the overall status as error
		if (Object.values(status.services).some(service => service.status === 'error')) {
			status.status = 'error'
		}

		return status
	}

	private async checkDatabase() {
		try {
			// Check if database connection is alive
			if (!this.dataSource.isInitialized) {
				return { status: 'error', message: 'Database connection not initialized' }
			}
			
			await this.dataSource.query('SELECT 1')
			return { status: 'ok' }
		} catch (error) {
			return { 
				status: 'error', 
				message: error.message 
			}
		}
	}

	private async checkRedis() {
		try {
			// Check if Redis connection is alive
			await this.redisClient.ping()
			return { status: 'ok' }
		} catch (error) {
			return { 
				status: 'error', 
				message: error.message 
			}
		}
	}
}
