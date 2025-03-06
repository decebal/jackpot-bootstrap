import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, Like } from 'typeorm'
import { MetricsEntity } from '../entities/metrics.entity'
import { MetricData, MetricsRepositoryInterface } from '../../domain/interfaces/metrics.interface'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class MetricsRepository implements MetricsRepositoryInterface {
	private readonly CACHE_TTL = 60 * 5 // 5 minutes cache
	private readonly CACHE_PREFIX = 'metrics:'

	constructor(
		@InjectRepository(MetricsEntity)
		private readonly metricsRepository: Repository<MetricsEntity>,
		private readonly redisService: RedisService
	) {}

	async saveMetric(metric: MetricData): Promise<MetricData> {
		// Save to database
		const savedMetric = await this.metricsRepository.save(metric)
		
		// Invalidate relevant caches
		await this.invalidateCache(metric.source, metric.event_type)
		
		return savedMetric
	}

	async getMetrics(
		source: string,
		eventType: string,
		startDate: string,
		endDate: string,
		limit: number,
		offset: number
	): Promise<{ metrics: MetricData[], total: number }> {
		// Try to get from cache first
		const cacheKey = this.generateCacheKey(source, eventType, startDate, endDate, limit, offset)
		const cachedResult = await this.redisService.get(cacheKey)
		
		if (cachedResult) {
			return JSON.parse(cachedResult)
		}

		// Build query with filters
		const whereClause: any = {}
		
		if (source) {
			whereClause.source = source
		}
		
		if (eventType) {
			whereClause.event_type = eventType
		}
		
		if (startDate && endDate) {
			whereClause.timestamp = Between(startDate, endDate)
		}

		// Get total count
		const total = await this.metricsRepository.count({ where: whereClause })
		
		// Get paginated results
		const metrics = await this.metricsRepository.find({
			where: whereClause,
			take: limit,
			skip: offset,
			order: { timestamp: 'DESC' }
		})

		const result = { metrics, total }
		
		// Cache the result
		await this.redisService.set(
			cacheKey,
			JSON.stringify(result),
			this.CACHE_TTL
		)
		
		return result
	}

	async getMetricById(id: string): Promise<MetricData | null> {
		// Try to get from cache first
		const cacheKey = `${this.CACHE_PREFIX}id:${id}`
		const cachedMetric = await this.redisService.get(cacheKey)
		
		if (cachedMetric) {
			return JSON.parse(cachedMetric)
		}
		
		// Get from database
		const metric = await this.metricsRepository.findOne({ where: { id } })
		
		if (metric) {
			// Cache the result
			await this.redisService.set(
				cacheKey,
				JSON.stringify(metric),
				this.CACHE_TTL
			)
		}
		
		return metric || null
	}

	private generateCacheKey(
		source: string,
		eventType: string,
		startDate: string,
		endDate: string,
		limit: number,
		offset: number
	): string {
		return `${this.CACHE_PREFIX}list:${source}:${eventType}:${startDate}:${endDate}:${limit}:${offset}`
	}

	private async invalidateCache(source: string, eventType: string): Promise<void> {
		// Pattern to match all relevant cache keys
		const pattern = `${this.CACHE_PREFIX}list:${source}:${eventType}:*`
		await this.redisService.deleteByPattern(pattern)
		
		// Also invalidate general caches
		const generalPattern = `${this.CACHE_PREFIX}list::*`
		await this.redisService.deleteByPattern(generalPattern)
	}
}
