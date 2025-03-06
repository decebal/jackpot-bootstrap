import { Injectable, Inject } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { 
	Job, 
	ExecuteJobResponse, 
	JobSchedulerInterface 
} from './interfaces/scheduler.interface'
import { JobRepository } from '../infrastructure/repositories/job.repository'

@Injectable()
export class JobScheduler implements JobSchedulerInterface {
	private scheduledJobs: Map<string, NodeJS.Timeout> = new Map()
	private serviceClients: Map<string, any> = new Map()

	constructor(
		private readonly jobRepository: JobRepository,
		@Inject('METRICS_PACKAGE') private readonly metricsClient: ClientGrpc
	) {}

	onModuleInit() {
		// Initialize service clients
		this.serviceClients.set('metrics', this.metricsClient.getService('MetricsService'))
		
		// Load and schedule active jobs on startup
		this.loadActiveJobs()
	}

	private async loadActiveJobs() {
		try {
			const { jobs } = await this.jobRepository.getJobs('active', undefined, undefined, undefined, 1000, 0)
			
			for (const job of jobs) {
				await this.scheduleJob(job)
			}
			
			console.log(`Loaded and scheduled ${jobs.length} active jobs`)
		} catch (error) {
			console.error('Error loading active jobs:', error)
		}
	}

	async scheduleJob(job: Job): Promise<void> {
		// Unschedule the job first if it's already scheduled
		await this.unscheduleJob(job.id)
		
		// Calculate the delay until the next execution
		const now = new Date()
		const nextExecution = new Date(job.next_execution || now.toISOString())
		const delay = Math.max(0, nextExecution.getTime() - now.getTime())
		
		// Schedule the job
		const timeout = setTimeout(async () => {
			try {
				// Execute the job
				await this.executeJob(job)
				
				// Reschedule the job if it's still active
				const updatedJob = await this.jobRepository.getJobById(job.id)
				if (updatedJob && updatedJob.status === 'active') {
					// Calculate the next execution time
					const nextExecution = this.calculateNextExecution(updatedJob.schedule)
					
					// Update the job with the next execution time
					await this.jobRepository.updateJob({
						...updatedJob,
						next_execution: nextExecution
					})
					
					// Reschedule the job
					await this.scheduleJob({
						...updatedJob,
						next_execution: nextExecution
					})
				}
			} catch (error) {
				console.error(`Error executing scheduled job ${job.id}:`, error)
			}
		}, delay)
		
		// Store the timeout reference
		this.scheduledJobs.set(job.id, timeout)
		
		console.log(`Scheduled job ${job.id} (${job.name}) to run at ${nextExecution.toISOString()}`)
	}

	async unscheduleJob(jobId: string): Promise<void> {
		const timeout = this.scheduledJobs.get(jobId)
		if (timeout) {
			clearTimeout(timeout)
			this.scheduledJobs.delete(jobId)
			console.log(`Unscheduled job ${jobId}`)
		}
	}

	async executeJob(job: Job): Promise<ExecuteJobResponse> {
		console.log(`Executing job ${job.id} (${job.name})`)
		
		const startTime = Date.now()
		
		try {
			// Get the target service client
			const serviceClient = this.serviceClients.get(job.target.service)
			
			if (!serviceClient) {
				throw new Error(`Service client not found for ${job.target.service}`)
			}
			
			// Check if the method exists
			if (!serviceClient[job.target.method]) {
				throw new Error(`Method ${job.target.method} not found in service ${job.target.service}`)
			}
			
			// Execute the method with the provided payload
			const result = await firstValueFrom(
				serviceClient[job.target.method](job.target.payload)
			)
			
			const executionTime = Date.now() - startTime
			
			// Return success response
			return {
				success: true,
				data: result,
				executionTime
			}
		} catch (error) {
			const executionTime = Date.now() - startTime
			
			// Handle retries if configured
			const retries = job.retries || 0
			const maxRetries = job.max_retries || 3 // Default to 3 if not specified
			
			if (retries < maxRetries) {
				// Update retry count
				await this.jobRepository.updateJob({
					...job,
					retries: retries + 1,
					error: error.message,
					last_executed_at: new Date().toISOString()
				})
				
				// Schedule a retry with exponential backoff
				const retryDelay = Math.min(
					30000, // Max 30 seconds
					1000 * Math.pow(2, retries) // Exponential backoff
				)
				
				setTimeout(() => {
					this.executeJob(job).catch(err => {
						console.error(`Error in retry execution of job ${job.id}:`, err)
					})
				}, retryDelay)
				
				console.log(`Scheduled retry for job ${job.id} in ${retryDelay}ms (retry ${retries + 1}/${maxRetries})`)
			}
			
			// Return error response
			return {
				success: false,
				error: error.message,
				executionTime
			}
		}
	}

	private calculateNextExecution(cronExpression: string): string {
		try {
			// This is a simplified implementation
			// In a real application, you would use a library like node-cron or cron-parser
			// to calculate the next execution time based on the cron expression
			const now = new Date()
			// For simplicity, we'll add 1 hour to the current time
			// In a real implementation, this would be calculated based on the cron expression
			const nextExecution = new Date(now.getTime() + 60 * 60 * 1000)
			return nextExecution.toISOString()
		} catch (error) {
			console.error('Error calculating next execution time:', error)
			// Default to 1 hour from now if there's an error
			const now = new Date()
			const nextExecution = new Date(now.getTime() + 60 * 60 * 1000)
			return nextExecution.toISOString()
		}
	}
}
