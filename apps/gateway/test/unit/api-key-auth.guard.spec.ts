import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyAuthGuard } from '../../src/guards/api-key-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';

describe('ApiKeyAuthGuard', () => {
	let guard: ApiKeyAuthGuard;
	let mockConfigService: Partial<ConfigService>;

	beforeEach(async () => {
		// Create mock for ConfigService
		mockConfigService = {
			get: jest.fn().mockImplementation((key) => {
				if (key === 'API_KEY') {
					return 'test-api-key';
				}
				return null;
			})
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ApiKeyAuthGuard,
				{
					provide: ConfigService,
					useValue: mockConfigService
				}
			],
		}).compile();

		guard = module.get<ApiKeyAuthGuard>(ApiKeyAuthGuard);
	});

	it('should be defined', () => {
		expect(guard).toBeDefined();
	});

	it('should allow access with valid API key in header', async () => {
		// Arrange
		const mockContext = {
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue({
					headers: {
						'x-api-key': 'test-api-key'
					},
					header: jest.fn().mockImplementation((name) => {
						return name.toLowerCase() === 'x-api-key' ? 'test-api-key' : undefined;
					}),
					query: {}
				})
			})
		} as unknown as ExecutionContext;

		// Act
		const result = await guard.canActivate(mockContext);

		// Assert
		expect(result).toBe(true);
		expect(mockConfigService.get).toHaveBeenCalledWith('API_KEY');
	});

	it('should deny access with invalid API key in header', async () => {
		// Arrange
		const mockContext = {
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue({
					headers: {
						'x-api-key': 'invalid-api-key'
					},
					header: jest.fn().mockImplementation((name) => {
						return name.toLowerCase() === 'x-api-key' ? 'invalid-api-key' : undefined;
					}),
					query: {}
				})
			})
		} as unknown as ExecutionContext;

		// Act & Assert
		expect(() => guard.canActivate(mockContext)).toThrow('Invalid API key');
		expect(mockConfigService.get).toHaveBeenCalledWith('API_KEY');
	});

	it('should deny access with missing API key in header', async () => {
		// Arrange
		const mockContext = {
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue({
					headers: {},
					header: jest.fn().mockReturnValue(undefined),
					query: {}
				})
			})
		} as unknown as ExecutionContext;

		// Act & Assert
		expect(() => guard.canActivate(mockContext)).toThrow('API key is missing');
		// The ConfigService.get method is not called because the guard throws an exception before reaching that code
	});
});
