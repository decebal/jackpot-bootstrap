import { Test, TestingModule } from '@nestjs/testing'
import { MetricsService } from '../src/metrics.service'
import { MetricsProcessor } from '../src/domain/metrics.processor'
import { ReportGenerator } from '../src/domain/report.generator'
import { MetricsRepository } from '../src/infrastructure/repositories/metrics.repository'
import { CollectMetricsRequest, MetricData } from '../src/domain/interfaces/metrics.interface'

// Mock dependencies
jest.mock('../src/domain/metrics.processor')
jest.mock('../src/domain/report.generator')
jest.mock('../src/infrastructure/repositories/metrics.repository')

describe('MetricsService', () => {
	let service: MetricsService
	let metricsProcessor: jest.Mocked<MetricsProcessor>
	let reportGenerator: jest.Mocked<ReportGenerator>
	let metricsRepository: jest.Mocked<MetricsRepository>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MetricsService,
				MetricsProcessor,
				ReportGenerator,
				MetricsRepository
			],
		}).compile()

		service = module.get<MetricsService>(MetricsService)
		metricsProcessor = module.get(MetricsProcessor) as jest.Mocked<MetricsProcessor>
		reportGenerator = module.get(ReportGenerator) as jest.Mocked<ReportGenerator>
		metricsRepository = module.get(MetricsRepository) as jest.Mocked<MetricsRepository>
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('collectMetrics', () => {
		it('should process and save metrics', async () => {
			// Arrange
			const request: CollectMetricsRequest = {
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 }
			}
			
			const processedMetric: MetricData = {
				id: 'test-id',
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 },
				timestamp: '2023-01-01T00:00:00.000Z'
			}
			
			metricsProcessor.processMetrics.mockResolvedValue(processedMetric)
			metricsRepository.saveMetric.mockResolvedValue(processedMetric)
			
			// Act
			const result = await service.collectMetrics(request)
			
			// Assert
			expect(metricsProcessor.processMetrics).toHaveBeenCalledWith(request)
			expect(metricsRepository.saveMetric).toHaveBeenCalledWith(processedMetric)
			expect(result).toEqual(processedMetric)
		})
	})

	describe('getMetrics', () => {
		it('should retrieve metrics with filters', async () => {
			// Arrange
			const source = 'test-source'
			const eventType = 'test-event'
			const startDate = '2023-01-01T00:00:00.000Z'
			const endDate = '2023-01-02T00:00:00.000Z'
			const limit = 10
			const offset = 0
			
			const expectedResult = {
				metrics: [
					{
						id: 'test-id',
						source: 'test-source',
						event_type: 'test-event',
						data: { value: 100 },
						timestamp: '2023-01-01T12:00:00.000Z'
					}
				],
				total: 1
			}
			
			metricsRepository.getMetrics.mockResolvedValue(expectedResult)
			
			// Act
			const result = await service.getMetrics(
				source,
				eventType,
				startDate,
				endDate,
				limit,
				offset
			)
			
			// Assert
			expect(metricsRepository.getMetrics).toHaveBeenCalledWith(
				source,
				eventType,
				startDate,
				endDate,
				limit,
				offset
			)
			expect(result).toEqual(expectedResult)
		})
	})

	describe('getMetricById', () => {
		it('should retrieve a metric by ID', async () => {
			// Arrange
			const id = 'test-id'
			const expectedMetric: MetricData = {
				id: 'test-id',
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 },
				timestamp: '2023-01-01T12:00:00.000Z'
			}
			
			metricsRepository.getMetricById.mockResolvedValue(expectedMetric)
			
			// Act
			const result = await service.getMetricById(id)
			
			// Assert
			expect(metricsRepository.getMetricById).toHaveBeenCalledWith(id)
			expect(result).toEqual(expectedMetric)
		})
		
		it('should return null if metric not found', async () => {
			// Arrange
			const id = 'non-existent-id'
			metricsRepository.getMetricById.mockResolvedValue(null)
			
			// Act
			const result = await service.getMetricById(id)
			
			// Assert
			expect(metricsRepository.getMetricById).toHaveBeenCalledWith(id)
			expect(result).toBeNull()
		})
	})

	describe('generateReport', () => {
		it('should generate a report', async () => {
			// Arrange
			const reportType = 'summary'
			const startDate = '2023-01-01T00:00:00.000Z'
			const endDate = '2023-01-02T00:00:00.000Z'
			const format = 'json'
			
			const expectedReport = {
				id: 'report-id',
				type: 'summary',
				data: [{ source: 'test-source', event_type: 'test-event', count: 5 }],
				format: 'json',
				timestamp: '2023-01-02T12:00:00.000Z'
			}
			
			reportGenerator.generateReport.mockResolvedValue(expectedReport)
			
			// Act
			const result = await service.generateReport(
				reportType,
				startDate,
				endDate,
				format
			)
			
			// Assert
			expect(reportGenerator.generateReport).toHaveBeenCalledWith(
				reportType,
				startDate,
				endDate,
				format
			)
			expect(result).toEqual(expectedReport)
		})
	})
})
