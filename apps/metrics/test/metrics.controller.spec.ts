import { Test, TestingModule } from '@nestjs/testing'
import { MetricsController } from '../src/metrics.controller'
import { MetricsService } from '../src/metrics.service'
import { CollectMetricsRequest, MetricData, GenerateReportRequest } from '../src/domain/interfaces/metrics.interface'

// Mock dependencies
jest.mock('../src/metrics.service')

describe('MetricsController', () => {
	let controller: MetricsController
	let metricsService: jest.Mocked<MetricsService>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MetricsController],
			providers: [MetricsService],
		}).compile()

		controller = module.get<MetricsController>(MetricsController)
		metricsService = module.get(MetricsService) as jest.Mocked<MetricsService>
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('collectMetrics', () => {
		it('should call service.collectMetrics with the request data', async () => {
			// Arrange
			const request: CollectMetricsRequest = {
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 }
			}
			
			const expectedResult: MetricData = {
				id: 'test-id',
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 },
				timestamp: '2023-01-01T00:00:00.000Z'
			}
			
			metricsService.collectMetrics.mockResolvedValue(expectedResult)
			
			// Act
			const result = await controller.collectMetrics(request)
			
			// Assert
			expect(metricsService.collectMetrics).toHaveBeenCalledWith(request)
			expect(result).toEqual({
				success: true,
				metric: expectedResult
			})
		})
	})

	describe('getMetrics', () => {
		it('should call service.getMetrics with the request parameters', async () => {
			// Arrange
			const request = {
				source: 'test-source',
				event_type: 'test-event',
				start_date: '2023-01-01T00:00:00.000Z',
				end_date: '2023-01-02T00:00:00.000Z',
				limit: 10,
				offset: 0
			}
			
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
			
			metricsService.getMetrics.mockResolvedValue(expectedResult)
			
			// Act
			const result = await controller.getMetrics(request)
			
			// Assert
			expect(metricsService.getMetrics).toHaveBeenCalledWith(
				request.source,
				request.event_type,
				request.start_date,
				request.end_date,
				request.limit,
				request.offset
			)
			expect(result).toEqual({
				success: true,
				...expectedResult
			})
		})
	})

	describe('getMetricById', () => {
		it('should call service.getMetricById with the request id', async () => {
			// Arrange
			const request = { id: 'test-id' }
			
			const expectedMetric: MetricData = {
				id: 'test-id',
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 },
				timestamp: '2023-01-01T12:00:00.000Z'
			}
			
			metricsService.getMetricById.mockResolvedValue(expectedMetric)
			
			// Act
			const result = await controller.getMetricById(request)
			
			// Assert
			expect(metricsService.getMetricById).toHaveBeenCalledWith(request.id)
			expect(result).toEqual({
				success: true,
				metric: expectedMetric
			})
		})
		
		it('should return empty object if metric not found', async () => {
			// Arrange
			const request = { id: 'non-existent-id' }
			metricsService.getMetricById.mockResolvedValue(null)
			
			// Act
			const result = await controller.getMetricById(request)
			
			// Assert
			expect(metricsService.getMetricById).toHaveBeenCalledWith(request.id)
			expect(result).toEqual({
				success: true,
				metric: null
			})
		})
	})

	describe('generateReport', () => {
		it('should call service.generateReport with the request parameters', async () => {
			// Arrange
			const request: GenerateReportRequest = {
				report_type: 'summary',
				start_date: '2023-01-01T00:00:00.000Z',
				end_date: '2023-01-02T00:00:00.000Z',
				format: 'json'
			}
			
			const expectedReport = {
				id: 'report-id',
				type: 'summary',
				data: [{ source: 'test-source', event_type: 'test-event', count: 5 }],
				format: 'json',
				timestamp: '2023-01-02T12:00:00.000Z'
			}
			
			metricsService.generateReport.mockResolvedValue(expectedReport)
			
			// Act
			const result = await controller.generateReport(request)
			
			// Assert
			expect(metricsService.generateReport).toHaveBeenCalledWith(
				request.report_type,
				request.start_date,
				request.end_date,
				request.format
			)
			expect(result).toEqual({
				success: true,
				report: expectedReport
			})
		})
	})
})
