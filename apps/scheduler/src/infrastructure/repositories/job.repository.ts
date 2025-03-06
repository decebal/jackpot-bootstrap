import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, LessThanOrEqual } from 'typeorm'
import { JobEntity } from '../entities/job.entity'
import { 
	Job, 
	GetJobsResponse, 
	JobRepositoryInterface 
} from '../../domain/interfaces/scheduler.interface'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class JobRepository implements JobRepositoryInterface {
	private readonly CACHE_TTL = 60 * 5 // 5 minutes in seconds
	private readonly CACHE_PREFIX = 'job:'

	constructor(
		@InjectRepository(JobEntity)
		private readonly jobRepository: Repository<JobEntity>,
		private readonly redisService: RedisService
	) {}

	async saveJob(job: Job): Promise<Job> {
		// Save to database
		const savedJob = await this.jobRepository.save(job)
		
		// Cache the job
		await this.cacheJob(savedJob)
		
		return savedJob
	}

	async getJobById(id: string): Promise<Job | null> {
		// Try to get from cache first
		const cachedJob = await this.getCachedJob(id)
		if (cachedJob) {
			return cachedJob
		}
		
		// If not in cache, get from database
		const job = await this.jobRepository.findOne({ where: { id } })
		
		if (job) {
			// Cache the job for future requests
			await this.cacheJob(job)
			return job
		}
		
		return null
	}

	async getJobs(
		status?: string,
		type?: string,
		startDate?: string,
		endDate?: string,
		limit = 10,
		offset = 0
	): Promise<GetJobsResponse> {
		// Build query conditions
		const where: any = {}
		
		if (status) {
			where.status = status
		}
		
		if (type) {
			where.type = type
		}
		
		if (startDate && endDate) {
			where.created_at = Between(startDate, endDate)
		} else if (startDate) {
			where.created_at = LessThanOrEqual(startDate)
		}
		
		// Get total count
		const total = await this.jobRepository.count({ where })
		
		// Get jobs with pagination
		const jobs = await this.jobRepository.find({
			where,
			order: { created_at: 'DESC' },
			take: limit,
			skip: offset
		})
		
		return { jobs, total }
	}

	async updateJob(job: Job): Promise<Job> {
		// Update in database
		await this.jobRepository.update(job.id, job)
		
		// Get the updated job
		const updatedJob = await this.jobRepository.findOne({ where: { id: job.id } })
		
		if (!updatedJob) {
			throw new Error(`Job with ID ${job.id} not found after update`)
		}
		
		// Update in cache
		await this.cacheJob(updatedJob)
		
		return updatedJob
	}

	async deleteJob(id: string): Promise<boolean> {
		// Delete from database
		const result = await this.jobRepository.delete(id)
		
		// Delete from cache
		await this.redisService.del(`${this.CACHE_PREFIX}${id}`)
		
		return result.affected !== null && result.affected !== undefined && result.affected > 0
	}

	async getJobsDueForExecution(): Promise<Job[]> {
		const now = new Date().toISOString()
		
		// Get all active jobs that are due for execution
		return this.jobRepository.find({
			where: {
				status: 'active',
				next_execution: LessThanOrEqual(now)
			}
		})
	}

	private async cacheJob(job: Job): Promise<void> {
		await this.redisService.set(
			`${this.CACHE_PREFIX}${job.id}`,
			JSON.stringify(job),
			this.CACHE_TTL
		)
	}

	private async getCachedJob(id: string): Promise<Job | null> {
		const cachedJob = await this.redisService.get(`${this.CACHE_PREFIX}${id}`)
		
		if (cachedJob) {
			try {
				return JSON.parse(cachedJob)
			} catch (error) {
				console.error(`Error parsing cached job ${id}:`, error)
			}
		}
		
		return null
	}
}
