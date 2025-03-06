import { Injectable } from '@nestjs/common'
import { z } from 'zod'
import { Job } from './interfaces/scheduler.interface'

@Injectable()
export class JobValidator {
	private jobSchema = z.object({
		id: z.string().uuid(),
		name: z.string().min(1).max(100),
		type: z.string().min(1).max(50),
		schedule: z.string().min(1), // Cron expression
		target: z.object({
			service: z.string().min(1),
			method: z.string().min(1),
			payload: z.any()
		}),
		status: z.enum(['active', 'inactive', 'completed', 'failed']),
		created_at: z.string().datetime(),
		updated_at: z.string().datetime(),
		last_executed_at: z.string().datetime().optional(),
		next_execution: z.string().datetime().optional(),
		result: z.any().optional(),
		error: z.string().optional(),
		metadata: z.record(z.any()).optional(),
		retries: z.number().int().min(0).optional(),
		max_retries: z.number().int().min(0).optional(),
		timeout: z.number().int().min(1000).optional() // Minimum 1 second
	})

	validateJob(job: Job): boolean {
		try {
			this.jobSchema.parse(job)
			return this.validateCronExpression(job.schedule)
		} catch (error) {
			console.error('Job validation error:', error)
			return false
		}
	}

	private validateCronExpression(cronExpression: string): boolean {
		// This is a simplified validation for cron expressions
		// In a real application, you would use a library like cron-parser to validate
		// the cron expression more thoroughly
		
		// Basic regex for cron expressions (simplified)
		// Format: minute hour day-of-month month day-of-week
		const cronRegex = /^(\*|\d+|\d+-\d+|\d+\/\d+|\d+,\d+)(\s+(\*|\d+|\d+-\d+|\d+\/\d+|\d+,\d+)){4}$/
		
		return cronRegex.test(cronExpression)
	}
}
