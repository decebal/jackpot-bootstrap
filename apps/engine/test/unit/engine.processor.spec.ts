import { Test, TestingModule } from '@nestjs/testing';
import { EngineProcessor } from '../../src/domain/engine.processor';
import { EngineValidator } from '../../src/domain/engine.validator';
import { ProcessRequest, ProcessResponse } from '../../src/domain/interfaces/engine.interface';

describe('EngineProcessor', () => {
	let engineProcessor: EngineProcessor;
	let mockEngineValidator: Partial<EngineValidator>;

	beforeEach(async () => {
		// Create mock for EngineValidator
		mockEngineValidator = {
			validateRequest: jest.fn().mockImplementation((request: ProcessRequest) => {
				if (!request.id || !request.data) {
					throw new Error('Invalid request data');
				}
				return true;
			})
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				EngineProcessor,
				{
					provide: EngineValidator,
					useValue: mockEngineValidator
				}
			],
		}).compile();

		engineProcessor = module.get<EngineProcessor>(EngineProcessor);
	});

	it('should be defined', () => {
		expect(engineProcessor).toBeDefined();
	});

	it('should process a valid engine request', async () => {
		// Arrange
		const timestamp = new Date().toISOString();
		const engineRequest: ProcessRequest = {
			id: 'test-request-id',
			data: { key: 'value' },
			timestamp
		};

		// Act
		const result = await engineProcessor.process(engineRequest);

		// Assert
		expect(result).toBeDefined();
		expect(result.id).toBe(engineRequest.id);
		expect(result.timestamp).toBeDefined();
		expect(result.status).toBe('completed');
		expect(result.result).toBeDefined();
		expect(mockEngineValidator.validateRequest).toHaveBeenCalledWith(engineRequest);
	});

	it('should throw an error for invalid request data', async () => {
		// Arrange
		const invalidRequest = {
			// Missing required fields (id and data)
			timestamp: new Date().toISOString()
		} as ProcessRequest;

		// Act & Assert
		await expect(engineProcessor.process(invalidRequest)).rejects.toThrow('Invalid request data');
		expect(mockEngineValidator.validateRequest).toHaveBeenCalledWith(invalidRequest);
	});
});
