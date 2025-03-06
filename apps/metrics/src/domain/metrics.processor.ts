import { Injectable } from '@nestjs/common'
import { MetricsValidator } from './metrics.validator'
import { CollectMetricsRequest, MetricData } from './interfaces/metrics.interface'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class MetricsProcessor {
	constructor(private readonly validator: MetricsValidator) {}

	async processMetrics(request: CollectMetricsRequest): Promise<MetricData> {
		// Validate request using Zod (following our validation standards)
		await this.validator.validateMetricsRequest(request)

		// Process the metrics data using functional programming patterns
		return this.transformMetricsData(request)
	}

	private transformMetricsData(request: CollectMetricsRequest): MetricData {
		// Following functional programming principles
		const timestamp = request.timestamp || new Date().toISOString()
		
		// Create a new metrics data object with a unique ID
		return {
			id: uuidv4(),
			source: request.source,
			event_type: request.event_type,
			data: request.data,
			timestamp
		}
	}
}
