import { EngineClient, EngineClientError } from '../engine-client'
import * as grpc from '@grpc/grpc-js'

// Mock the gRPC client
jest.mock('@grpc/grpc-js', () => {
	const mockMetadata = {
		add: jest.fn()
	}
	
	return {
		credentials: {
			createSsl: jest.fn(),
			createInsecure: jest.fn()
		},
		Metadata: jest.fn(() => mockMetadata),
		status: {
			OK: 0,
			CANCELLED: 1,
			UNKNOWN: 2,
			INVALID_ARGUMENT: 3,
			DEADLINE_EXCEEDED: 4,
			NOT_FOUND: 5,
			ALREADY_EXISTS: 6,
			PERMISSION_DENIED: 7,
			UNAUTHENTICATED: 16
		}
	}
})

// Mock the generated client
jest.mock('../generated/engine', () => {
	return {
		EngineServiceClient: jest.fn(() => ({
			processRequest: jest.fn(),
			getStatus: jest.fn(),
			cancelRequest: jest.fn(),
			processBatch: jest.fn(),
			getBatchStatus: jest.fn(),
			getEngineConfig: jest.fn(),
			updateEngineConfig: jest.fn(),
			getEngineStatus: jest.fn(),
			getEngineMetrics: jest.fn(),
			close: jest.fn()
		}))
	}
})

// Mock the engine-utils
jest.mock('../engine-utils', () => {
	return {
		createProcessRequest: jest.fn((type, content) => ({
			request_type: type,
			data: Buffer.from(content),
			timestamp: expect.any(String),
			metadata: {}
		})),
		handleGrpcError: jest.fn((error) => {
			throw new EngineClientError(error.message, error.code, error.details)
		})
	}
})

describe('EngineClient', () => {
	let client: EngineClient
	
	beforeEach(() => {
		jest.clearAllMocks()
		
		client = new EngineClient({
			host: 'localhost',
			port: 50051,
			apiKey: 'test-api-key'
		})
	})
	
	describe('process', () => {
		it('should successfully process a request', async () => {
			const mockResponse = {
				id: 'req_123',
				status: 'completed',
				success: true
			}
			
			// Get the mocked client instance
			const mockClient = (client as any).client
			
			// Setup the mock implementation
			mockClient.processRequest.mockImplementation((_: any, __: any, callback: any) => {
				callback(null, mockResponse)
			})
			
			const response = await client.process('test', 'test data', { priority: 5 })
			
			expect(response).toEqual(mockResponse)
			expect(mockClient.processRequest).toHaveBeenCalled()
		})
		
		it('should handle errors correctly', async () => {
			const mockError = {
				code: grpc.status.NOT_FOUND,
				details: 'Request not found',
				message: 'Not found'
			}
			
			// Get the mocked client instance
			const mockClient = (client as any).client
			
			// Setup the mock implementation
			mockClient.processRequest.mockImplementation((_: any, __: any, callback: any) => {
				callback(mockError, null)
			})
			
			await expect(client.process('test', 'test data')).rejects.toThrow(EngineClientError)
		})
	})
	
	describe('getStatus', () => {
		it('should get the status of a request', async () => {
			const mockResponse = {
				id: 'req_123',
				status: 'completed',
				success: true
			}
			
			// Get the mocked client instance
			const mockClient = (client as any).client
			
			// Setup the mock implementation
			mockClient.getStatus.mockImplementation((_request: any, _metadata: any, callback: any) => {
				callback(null, mockResponse)
			})
			
			const response = await client.getStatus('req_123')
			
			expect(response).toEqual(mockResponse)
			expect(mockClient.getStatus).toHaveBeenCalledWith(
				{ id: 'req_123' },
				expect.any(Object),
				expect.any(Function)
			)
		})
	})
	
	describe('getEngineStatus', () => {
		it('should get the engine status', async () => {
			const mockResponse = {
				success: true,
				status: {
					version: '1.0.0',
					status: 'running',
					uptime_seconds: 3600,
					active_requests: 5
				}
			}
			
			// Get the mocked client instance
			const mockClient = (client as any).client
			
			// Setup the mock implementation
			mockClient.getEngineStatus.mockImplementation((_request: any, _metadata: any, callback: any) => {
				callback(null, mockResponse)
			})
			
			const response = await client.getEngineStatus()
			
			expect(response).toEqual(mockResponse)
			expect(mockClient.getEngineStatus).toHaveBeenCalledWith(
				{},
				expect.any(Object),
				expect.any(Function)
			)
		})
	})
	
	describe('close', () => {
		it('should close the client connection', () => {
			// Get the mocked client instance
			const mockClient = (client as any).client
			
			client.close()
			
			expect(mockClient.close).toHaveBeenCalled()
		})
	})
})
