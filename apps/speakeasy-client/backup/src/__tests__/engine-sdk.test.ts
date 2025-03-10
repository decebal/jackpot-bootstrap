import { EngineClient } from '../engine-client'
import * as grpc from '@grpc/grpc-js'

// Mock the gRPC client
jest.mock('@grpc/grpc-js', () => {
	const mockMetadata = {
		add: jest.fn()
	}
	
	return {
		credentials: {
			createSsl: jest.fn(() => ({})),
			createInsecure: jest.fn(() => ({}))
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
		EngineServiceClient: jest.fn().mockImplementation(() => ({
			processRequest: jest.fn((request, metadata, callback) => {
				if (request.id === 'error_request') {
					callback({
						code: 3,
						details: 'Invalid request',
						message: 'Invalid argument'
					}, null)
				} else {
					callback(null, {
						id: request.id || 'test_id',
						status: 'completed',
						success: true,
						result: Buffer.from('test result'),
						timestamp: new Date().toISOString(),
						metadata: {}
					})
				}
			}),
			getStatus: jest.fn((request, metadata, callback) => {
				if (request.id === 'not_found') {
					callback({
						code: 5,
						details: 'Request not found',
						message: 'Not found'
					}, null)
				} else {
					callback(null, {
						id: request.id,
						status: 'completed',
						success: true,
						result: Buffer.from('test result'),
						timestamp: new Date().toISOString(),
						metadata: {}
					})
				}
			}),
			cancelRequest: jest.fn((request, metadata, callback) => {
				callback(null, {
					success: true,
					message: 'Request cancelled',
					error: ''
				})
			}),
			processBatch: jest.fn((request, metadata, callback) => {
				callback(null, {
					batch_id: request.batch_id,
					success: true,
					status: 'processing',
					error: '',
					total_requests: request.requests.length,
					completed_requests: 0,
					failed_requests: 0
				})
			}),
			getBatchStatus: jest.fn((request, metadata, callback) => {
				callback(null, {
					batch_id: request.batch_id,
					success: true,
					status: 'completed',
					error: '',
					total_requests: 2,
					completed_requests: 2,
					failed_requests: 0,
					results: []
				})
			}),
			getEngineConfig: jest.fn((request, metadata, callback) => {
				callback(null, {
					success: true,
					config: {
						max_concurrent_requests: 10,
						default_timeout: 30,
						max_request_size_bytes: 10485760,
						max_batch_size: 100,
						resource_limits: {},
						feature_flags: {}
					},
					error: ''
				})
			}),
			updateEngineConfig: jest.fn((request, metadata, callback) => {
				callback(null, {
					success: true,
					config: request.config,
					error: ''
				})
			}),
			getEngineStatus: jest.fn((request, metadata, callback) => {
				callback(null, {
					success: true,
					status: {
						version: '1.0.0',
						status: 'running',
						uptime_seconds: 3600,
						active_requests: 5,
						queued_requests: 2,
						completed_requests: 100,
						failed_requests: 2,
						resources: {
							cpu_usage_percent: 25,
							memory_usage_mb: 512,
							disk_usage_mb: 1024,
							network_rx_kbps: 100,
							network_tx_kbps: 200
						},
						environment: {}
					},
					error: ''
				})
			}),
			getEngineMetrics: jest.fn((request, metadata, callback) => {
				callback(null, {
					success: true,
					metrics: [
						{
							timestamp: new Date().toISOString(),
							metric_name: 'requests_per_second',
							value: 10.5,
							labels: {}
						}
					],
					error: ''
				})
			}),
			close: jest.fn()
		}))
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
	
	afterEach(() => {
		client.close()
	})
	
	describe('process', () => {
		it('should successfully process a request', async () => {
			const response = await client.process(
				'text-processing',
				'test data',
				{ priority: 5, timeout: 60 },
				{ source: 'test' }
			)
			
			expect(response).toBeDefined()
			expect(response.success).toBe(true)
			expect(response.status).toBe('completed')
		})
		
		it('should handle errors correctly', async () => {
			await expect(client.process(
				'text-processing',
				'test data',
				{ priority: 5, timeout: 60 },
				{ source: 'test', id: 'error_request' }
			)).rejects.toThrow('Invalid argument: Invalid request')
		})
	})
	
	describe('getStatus', () => {
		it('should get the status of a request', async () => {
			const response = await client.getStatus('test_id')
			
			expect(response).toBeDefined()
			expect(response.id).toBe('test_id')
			expect(response.status).toBe('completed')
			expect(response.success).toBe(true)
		})
		
		it('should handle not found errors', async () => {
			await expect(client.getStatus('not_found')).rejects.toThrow('Not found: Request not found')
		})
	})
	
	describe('cancelRequest', () => {
		it('should cancel a request', async () => {
			const response = await client.cancelRequest('test_id', 'user requested')
			
			expect(response).toBeDefined()
			expect(response.success).toBe(true)
			expect(response.message).toBe('Request cancelled')
		})
	})
	
	describe('processBatch', () => {
		it('should process a batch of requests', async () => {
			const requests = [
				{
					requestType: 'text-processing',
					data: 'test data 1',
					options: { priority: 5 },
					metadata: { source: 'test' }
				},
				{
					requestType: 'text-processing',
					data: 'test data 2',
					options: { priority: 3 },
					metadata: { source: 'test' }
				}
			]
			
			const response = await client.processBatch(requests, { parallel: true, maxConcurrent: 2 })
			
			expect(response).toBeDefined()
			expect(response.success).toBe(true)
			expect(response.status).toBe('processing')
			expect(response.totalRequests).toBe(2)
		})
	})
	
	describe('getBatchStatus', () => {
		it('should get the status of a batch', async () => {
			const response = await client.getBatchStatus('batch_123', true)
			
			expect(response).toBeDefined()
			expect(response.batchId).toBe('batch_123')
			expect(response.success).toBe(true)
			expect(response.status).toBe('completed')
			expect(response.totalRequests).toBe(2)
			expect(response.completedRequests).toBe(2)
		})
	})
	
	describe('getEngineConfig', () => {
		it('should get the engine configuration', async () => {
			const response = await client.getEngineConfig()
			
			expect(response).toBeDefined()
			expect(response.success).toBe(true)
			expect(response.config).toBeDefined()
			expect(response.config?.maxConcurrentRequests).toBe(10)
		})
	})
	
	describe('updateEngineConfig', () => {
		it('should update the engine configuration', async () => {
			const config = {
				maxConcurrentRequests: 20,
				defaultTimeout: 60,
				maxRequestSizeBytes: 20971520,
				maxBatchSize: 200,
				resourceLimits: { 'cpu': '4' },
				featureFlags: { 'beta-feature': 'true' }
			}
			
			const response = await client.updateEngineConfig(config)
			
			expect(response).toBeDefined()
			expect(response.success).toBe(true)
			expect(response.config).toBeDefined()
		})
	})
	
	describe('getEngineStatus', () => {
		it('should get the engine status', async () => {
			const response = await client.getEngineStatus()
			
			expect(response).toBeDefined()
			expect(response.success).toBe(true)
			expect(response.status).toBeDefined()
			expect(response.status?.version).toBe('1.0.0')
			expect(response.status?.status).toBe('running')
		})
	})
	
	describe('getEngineMetrics', () => {
		it('should get the engine metrics', async () => {
			const startTime = new Date()
			startTime.setHours(startTime.getHours() - 1)
			
			const endTime = new Date()
			
			const response = await client.getEngineMetrics(
				startTime.toISOString(),
				endTime.toISOString(),
				'requests_per_second',
				60
			)
			
			expect(response).toBeDefined()
			expect(response.success).toBe(true)
			expect(response.metrics).toHaveLength(1)
			expect(response.metrics[0].metricName).toBe('requests_per_second')
		})
	})
})
