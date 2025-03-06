import { Injectable, Inject } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { 
	CreateJobRequest, 
	JobResponse, 
	GetJobsResponse,
	UpdateJobRequest,
	ExecuteJobResponse,
	Job
} from './domain/interfaces/scheduler.interface'
import { JobProcessor } from './domain/job.processor'
import { JobRepository } from './infrastructure/repositories/job.repository'
import { JobScheduler } from './domain/job.scheduler'

@Injectable()
export class SchedulerService {
	private metricsService: any

	constructor(
		private readonly jobProcessor: JobProcessor,
		private readonly jobRepository: JobRepository,
		private readonly jobScheduler: JobScheduler,
		@Inject('METRICS_PACKAGE') private readonly metricsClient: ClientGrpc
	) {}

	onModuleInit() {
		this.metricsService = this.metricsClient.getService('MetricsService')
	}

	async createJob(request: CreateJobRequest): Promise<JobResponse> {
		const processedJob = await this.jobProcessor.processJob(request)
		const savedJob = await this.jobRepository.saveJob(processedJob)
		
		// Schedule the job if it's active
		if (savedJob.status === 'active') {
			await this.jobScheduler.scheduleJob(savedJob)
		}
		
		// Record metric for job creation
		await this.recordMetric('job_created', {
			job_id: savedJob.id,
			job_type: savedJob.type,
		})
		
		return savedJob
	}

	async getJob(id: string): Promise<JobResponse | null> {
		return this.jobRepository.getJobById(id)
	}

	async getJobs(
		status?: string,
		type?: string,
		startDate?: string,
		endDate?: string,
		limit = 10,
		offset = 0
	): Promise<GetJobsResponse> {
		return this.jobRepository.getJobs(
			status,
			type,
			startDate,
			endDate,
			limit,
			offset
		)
	}

	async updateJob(request: UpdateJobRequest): Promise<JobResponse> {
		const existingJob = await this.jobRepository.getJobById(request.id)
		
		if (!existingJob) {
			throw new Error(`Job with ID ${request.id} not found`)
		}
		
		const updatedJob = {
			...existingJob,
			...request,
			updated_at: new Date().toISOString()
		}
		
		const savedJob = await this.jobRepository.updateJob(updatedJob)
		
		// If status changed, handle scheduling/unscheduling
		if (request.status && request.status !== existingJob.status) {
			if (request.status === 'active') {
				await this.jobScheduler.scheduleJob(savedJob)
			} else if (request.status === 'inactive' || request.status === 'completed') {
				await this.jobScheduler.unscheduleJob(savedJob.id)
			}
		}
		
		// Record metric for job update
		await this.recordMetric('job_updated', {
			job_id: savedJob.id,
			job_type: savedJob.type,
			status: savedJob.status
		})
		
		return savedJob
	}

	async deleteJob(id: string): Promise<boolean> {
		const job = await this.jobRepository.getJobById(id)
		
		if (!job) {
			return false
		}
		
		// Unschedule the job first
		await this.jobScheduler.unscheduleJob(id)
		
		// Delete the job
		const result = await this.jobRepository.deleteJob(id)
		
		// Record metric for job deletion
		if (result) {
			await this.recordMetric('job_deleted', {
				job_id: id,
				job_type: job.type
			})
		}
		
		return result
	}

	async executeJob(id: string): Promise<ExecuteJobResponse> {
		const job = await this.jobRepository.getJobById(id)
		
		if (!job) {
			throw new Error(`Job with ID ${id} not found`)
		}
		
		try {
			// Execute the job
			const result = await this.jobScheduler.executeJob(job)
			
			// Update job status to completed if successful
			if (result.success) {
				await this.updateJob({
					id,
					status: 'completed',
					last_executed_at: new Date().toISOString(),
					result: result.data
				})
			} else {
				await this.updateJob({
					id,
					status: 'failed',
					last_executed_at: new Date().toISOString(),
					error: result.error
				})
			}
			
			// Record metric for job execution
			await this.recordMetric('job_executed', {
				job_id: id,
				job_type: job.type,
				success: result.success,
				execution_time: result.executionTime
			})
			
			return result
		} catch (error) {
			// Update job status to failed
			await this.updateJob({
				id,
				status: 'failed',
				last_executed_at: new Date().toISOString(),
				error: error.message
			})
			
			// Record metric for job execution failure
			await this.recordMetric('job_execution_failed', {
				job_id: id,
				job_type: job.type,
				error: error.message
			})
			
			return {
				success: false,
				error: error.message,
				executionTime: 0
			}
		}
	}

	private async recordMetric(eventType: string, data: any) {
		try {
			await firstValueFrom(
				this.metricsService.collectMetrics({
					source: 'scheduler',
					event_type: eventType,
					data
				})
			)
		} catch (error) {
			console.error(`Failed to record metric ${eventType}:`, error)
		}
	}
}
