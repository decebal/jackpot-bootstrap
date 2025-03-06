import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class MetricsValidator {
	private readonly metricsRequestSchema = z.object({
		source: z.string().min(1, 'Source is required'),
		event_type: z.string().min(1, 'Event type is required'),
		data: z.any(),
		timestamp: z.string().datetime().optional(),
	})

	private readonly reportRequestSchema = z.object({
		report_type: z.string().min(1, 'Report type is required'),
		start_date: z.string().datetime(),
		end_date: z.string().datetime(),
		format: z.enum(['json', 'csv']),
	})

	async validateMetricsRequest(data: unknown) {
		return this.metricsRequestSchema.parseAsync(data)
	}

	async validateReportRequest(data: unknown) {
		return this.reportRequestSchema.parseAsync(data)
	}
}
