import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { RedisService } from '../infrastructure/redis/redis.service'

@Injectable()
export class HealthService {
	constructor(
		@InjectConnection() private readonly connection: Connection,
		private readonly redisService: RedisService
	) {}

	async check() {
		const status = {
			status: 'ok',
			services: {
				database: await this.checkDatabase(),
				redis: await this.checkRedis(),
				scheduler: await this.checkScheduler()
			}
		}
		
		// If any service is not ok, set overall status to error
		if (
			!status.services.database.isHealthy ||
			!status.services.redis.isHealthy ||
			!status.services.scheduler.isHealthy
		) {
			status.status = 'error'
		}
		
		return status
	}

	private async checkDatabase() {
		try {
			// Check if database connection is active
			const isConnected = this.connection.isConnected
			
			// Run a simple query to verify database is responsive
			if (isConnected) {
				await this.connection.query('SELECT 1')
			}
			
			return {
				isHealthy: isConnected,
				status: isConnected ? 'connected' : 'disconnected'
			}
		} catch (error) {
			return {
				isHealthy: false,
				status: 'error',
				error: error.message
			}
		}
	}

	private async checkRedis() {
		try {
			const isPingSuccessful = await this.redisService.ping()
			
			return {
				isHealthy: isPingSuccessful,
				status: isPingSuccessful ? 'connected' : 'disconnected'
			}
		} catch (error) {
			return {
				isHealthy: false,
				status: 'error',
				error: error.message
			}
		}
	}

	private async checkScheduler() {
		try {
			// Check if scheduler is running properly
			// This is a simplified check - in a real application,
			// you might want to check if scheduled jobs are being executed
			
			// For now, we'll just return a healthy status
			return {
				isHealthy: true,
				status: 'running',
				activeJobs: 0 // In a real app, you'd get the actual count
			}
		} catch (error) {
			return {
				isHealthy: false,
				status: 'error',
				error: error.message
			}
		}
	}
}
