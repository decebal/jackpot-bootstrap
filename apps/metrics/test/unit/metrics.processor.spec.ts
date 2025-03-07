import { Test, TestingModule } from '@nestjs/testing';
import { MetricsProcessor } from '../../src/domain/metrics.processor';
import { MetricsValidator } from '../../src/domain/metrics.validator';
import { CollectMetricsRequest, MetricData } from '../../src/domain/interfaces/metrics.interface';

describe('MetricsProcessor', () => {
	let metricsProcessor: MetricsProcessor;
	let mockMetricsValidator: Partial<MetricsValidator>;

	beforeEach(async () => {
		// Create mock for MetricsValidator
		mockMetricsValidator = {
			validateMetricsRequest: jest.fn().mockImplementation((request: CollectMetricsRequest) => {
				if (!request.event_type || !request.source) {
					throw new Error('Invalid metric data');
				}
				return request;
			})
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MetricsProcessor,
				{
					provide: MetricsValidator,
					useValue: mockMetricsValidator
				}
			],
		}).compile();

		metricsProcessor = module.get<MetricsProcessor>(MetricsProcessor);
	});

	it('should be defined', () => {
		expect(metricsProcessor).toBeDefined();
	});

	it('should process a valid metrics request', async () => {
		// Arrange
		const timestamp = new Date().toISOString();
		const metricsRequest: CollectMetricsRequest = {
			event_type: 'job_created',
			timestamp,
			source: 'scheduler',
			data: {
				job_id: 'test-job-id',
				job_type: 'test'
			}
		};

		// Act
		const result = await metricsProcessor.processMetrics(metricsRequest);

		// Assert
		expect(result).toBeDefined();
		expect(result.event_type).toBe(metricsRequest.event_type);
		expect(result.timestamp).toBe(timestamp);
		expect(result.source).toBe(metricsRequest.source);
		expect(result.data).toEqual(metricsRequest.data);
		expect(mockMetricsValidator.validateMetricsRequest).toHaveBeenCalledWith(metricsRequest);
	});

	it('should throw an error for invalid metrics data', async () => {
		// Arrange
		const invalidMetricsRequest = {
			// Missing required fields (event_type)
			source: 'scheduler',
			data: {
				job_id: 'test-job-id'
			}
		} as CollectMetricsRequest;

		// Act & Assert
		await expect(metricsProcessor.processMetrics(invalidMetricsRequest)).rejects.toThrow('Invalid metric data');
		expect(mockMetricsValidator.validateMetricsRequest).toHaveBeenCalledWith(invalidMetricsRequest);
	});
});
