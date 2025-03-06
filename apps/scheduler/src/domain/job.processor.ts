import { Injectable } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { 
	Job, 
	CreateJobRequest, 
	JobProcessorInterface 
} from './interfaces/scheduler.interface'
import { JobValidator } from './job.validator'

@Injectable()
export class JobProcessor implements JobProcessorInterface {
	constructor(private readonly jobValidator: JobValidator) {}

	async processJob(request: CreateJobRequest): Promise<Job> {
		// Create a new job from the request
		const now = new Date().toISOString()
		const job: Job = {
			id: uuidv4(),
			name: request.name,
			type: request.type,
			schedule: request.schedule,
			target: request.target,
			status: request.status || 'active',
			created_at: now,
			updated_at: now,
			metadata: request.metadata || {},
			retries: 0,
			max_retries: request.max_retries || 3,
			timeout: request.timeout || 30000, // Default timeout: 30 seconds
		}

		// Validate the job
		if (!this.jobValidator.validateJob(job)) {
			throw new Error('Invalid job request')
		}

		// Calculate next execution time based on cron expression
		job.next_execution = this.calculateNextExecution(job.schedule)

		return job
	}

	validateJob(job: Job): boolean {
		return this.jobValidator.validateJob(job)
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
