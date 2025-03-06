import { Injectable } from '@nestjs/common'
import { MetricsValidator } from './metrics.validator'
import { ReportData } from './interfaces/metrics.interface'
import { v4 as uuidv4 } from 'uuid'
import { MetricsRepository } from '../infrastructure/repositories/metrics.repository'

@Injectable()
export class ReportGenerator {
	constructor(
		private readonly validator: MetricsValidator,
		private readonly metricsRepository: MetricsRepository
	) {}

	async generateReport(
		reportType: string,
		startDate: string,
		endDate: string,
		format: string
	): Promise<ReportData> {
		// Validate request using Zod
		await this.validator.validateReportRequest({
			report_type: reportType,
			start_date: startDate,
			end_date: endDate,
			format
		})

		// Get metrics data for the report
		const { metrics } = await this.metricsRepository.getMetrics(
			'', // All sources
			'', // All event types
			startDate,
			endDate,
			1000, // Reasonable limit for report
			0
		)

		// Generate report based on type and format
		const reportData = this.processReportData(reportType, metrics, format)

		return {
			id: uuidv4(),
			type: reportType,
			data: reportData,
			format,
			timestamp: new Date().toISOString()
		}
	}

	private processReportData(reportType: string, metrics: any[], format: string): any {
		// Apply different processing based on report type
		const processedData = this.applyReportLogic(reportType, metrics)
		
		// Format the data according to the requested format
		return format === 'csv' 
			? this.convertToCSV(processedData) 
			: processedData
	}

	private applyReportLogic(reportType: string, metrics: any[]): any {
		// Implement different report logic based on report type
		switch (reportType) {
			case 'summary':
				return this.generateSummaryReport(metrics)
			case 'detailed':
				return this.generateDetailedReport(metrics)
			default:
				return metrics
		}
	}

	private generateSummaryReport(metrics: any[]): any {
		// Group metrics by source and event_type
		const summary = metrics.reduce((acc, metric) => {
			const key = `${metric.source}:${metric.event_type}`
			if (!acc[key]) {
				acc[key] = {
					source: metric.source,
					event_type: metric.event_type,
					count: 0
				}
			}
			acc[key].count++
			return acc
		}, {})

		return Object.values(summary)
	}

	private generateDetailedReport(metrics: any[]): any {
		// Return detailed metrics with formatted data
		return metrics.map(metric => ({
			id: metric.id,
			source: metric.source,
			event_type: metric.event_type,
			timestamp: metric.timestamp,
			data: typeof metric.data === 'object' 
				? metric.data 
				: JSON.parse(metric.data.toString())
		}))
	}

	private convertToCSV(data: any[]): string {
		if (!data.length) return ''
		
		// Get headers from first object
		const headers = Object.keys(data[0])
		
		// Create CSV header row
		const csvRows = [headers.join(',')]
		
		// Add data rows
		for (const row of data) {
			const values = headers.map(header => {
				const value = row[header]
				// Handle objects and escape commas
				return typeof value === 'object'
					? `"${JSON.stringify(value).replace(/"/g, '""')}"`
					: `"${String(value).replace(/"/g, '""')}"`
			})
			csvRows.push(values.join(','))
		}
		
		return csvRows.join('\n')
	}
}
