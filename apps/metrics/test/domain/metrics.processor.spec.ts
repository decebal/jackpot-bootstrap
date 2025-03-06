import { Test, TestingModule } from '@nestjs/testing'
import { MetricsProcessor } from '../../src/domain/metrics.processor'
import { MetricsValidator } from '../../src/domain/metrics.validator'
import { CollectMetricsRequest, MetricData } from '../../src/domain/interfaces/metrics.interface'

// Mock dependencies
jest.mock('../../src/domain/metrics.validator')

describe('MetricsProcessor', () => {
	let processor: MetricsProcessor
	let validator: jest.Mocked<MetricsValidator>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MetricsProcessor,
				MetricsValidator
			],
		}).compile()

		processor = module.get<MetricsProcessor>(MetricsProcessor)
		validator = module.get(MetricsValidator) as jest.Mocked<MetricsValidator>
	})

	it('should be defined', () => {
		expect(processor).toBeDefined()
	})

	describe('processMetrics', () => {
		it('should process valid metrics request', async () => {
			// Arrange
			const request: CollectMetricsRequest = {
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 }
			}
			
			validator.validateMetricsRequest.mockReturnValue(true)
			
			// Mock Date.now to return a consistent timestamp for testing
			const mockDate = new Date('2023-01-01T00:00:00.000Z')
			jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string)
			
			// Act
			const result = await processor.processMetrics(request)
			
			// Assert
			expect(validator.validateMetricsRequest).toHaveBeenCalledWith(request)
			expect(result).toMatchObject({
				source: request.source,
				event_type: request.event_type,
				data: request.data,
				timestamp: mockDate.toISOString()
			})
			expect(result.id).toBeDefined() // Should have a generated ID
			
			// Restore the original Date implementation
			jest.restoreAllMocks()
		})
		
		it('should throw an error for invalid metrics request', async () => {
			// Arrange
			const request: CollectMetricsRequest = {
				source: '',  // Invalid source
				event_type: 'test-event',
				data: { value: 100 }
			}
			
			validator.validateMetricsRequest.mockReturnValue(false)
			
			// Act & Assert
			await expect(processor.processMetrics(request)).rejects.toThrow('Invalid metrics request')
			expect(validator.validateMetricsRequest).toHaveBeenCalledWith(request)
		})
		
		it('should enrich metrics with additional context', async () => {
			// Arrange
			const request: CollectMetricsRequest = {
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 },
				context: { user_id: 'user-123', session_id: 'session-456' }
			}
			
			validator.validateMetricsRequest.mockReturnValue(true)
			
			// Mock Date.now to return a consistent timestamp for testing
			const mockDate = new Date('2023-01-01T00:00:00.000Z')
			jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string)
			
			// Act
			const result = await processor.processMetrics(request)
			
			// Assert
			expect(validator.validateMetricsRequest).toHaveBeenCalledWith(request)
			expect(result).toMatchObject({
				source: request.source,
				event_type: request.event_type,
				data: request.data,
				context: request.context,
				timestamp: mockDate.toISOString()
			})
			
			// Restore the original Date implementation
			jest.restoreAllMocks()
		})
		
		it('should handle metrics with tags', async () => {
			// Arrange
			const request: CollectMetricsRequest = {
				source: 'test-source',
				event_type: 'test-event',
				data: { value: 100 },
				tags: ['tag1', 'tag2']
			}
			
			validator.validateMetricsRequest.mockReturnValue(true)
			
			// Act
			const result = await processor.processMetrics(request)
			
			// Assert
			expect(result.tags).toEqual(request.tags)
		})
	})
})
