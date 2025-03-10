import * as grpc from '@grpc/grpc-js'
import { EngineServiceClient } from './generated/engine'
import {
  ProcessRequestMessage,
  ProcessResponseMessage,
  GetStatusRequest,
  CancelRequestMessage,
  CancelResponseMessage,
  ProcessBatchRequestMessage,
  ProcessBatchResponseMessage,
  GetBatchStatusRequest,
  GetBatchStatusResponse,
  GetEngineConfigRequest,
  GetEngineConfigResponse,
  UpdateEngineConfigRequest,
  UpdateEngineConfigResponse,
  GetEngineStatusRequest,
  GetEngineStatusResponse,
  GetEngineMetricsRequest,
  GetEngineMetricsResponse
} from './generated/engine'
import { createProcessRequest, handleGrpcError } from './engine-utils'

// Define the ProcessingOptions interface
export interface ProcessingOptions {
  priority?: number;
  timeout?: number;
  callback_url?: string;
  async?: boolean;
}

export interface EngineClientConfig {
  host: string
  port: number
  apiKey?: string
  secure?: boolean
  timeout?: number
}

export class EngineClientError extends Error {
  code?: number
  details?: string
  metadata?: Record<string, string>

  constructor(message: string, code?: number, details?: string, metadata?: Record<string, string>) {
    super(message)
    this.name = 'EngineClientError'
    if (code) {
      this.code = code
    }
    if (details) {
      this.details = details
    }
    if (metadata) {
      this.metadata = metadata
    }
  }
}

export class EngineClient {
  private client: EngineServiceClient
  private metadata: grpc.Metadata

  constructor(config: EngineClientConfig) {
    const { host, port, apiKey, secure = false, timeout = 30000 } = config
    const address = `${host}:${port}`
    
    // Create gRPC client with timeout
    this.client = new EngineServiceClient(
      address,
      secure 
        ? grpc.credentials.createSsl() 
        : grpc.credentials.createInsecure(),
      {
        'grpc.keepalive_timeout_ms': timeout
      }
    )
    
    // Setup metadata for authentication
    this.metadata = new grpc.Metadata()
    if (apiKey) {
      this.metadata.add('x-api-key', apiKey)
    }
  }

  /**
   * Process a request through the engine
   */
  async processRequest(request: ProcessRequestMessage): Promise<ProcessResponseMessage> {
    return new Promise((resolve, reject) => {
      this.client.processRequest(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }
  
  /**
   * Helper method to create and process a request in one step
   */
  async process(
    requestType: string,
    data: Buffer | Uint8Array | string,
    options?: Partial<ProcessingOptions>,
    metadata?: Record<string, string>
  ): Promise<ProcessResponseMessage> {
    const request = createProcessRequest(requestType, data, options, metadata)
    return this.processRequest(request)
  }

  /**
   * Get the status of a previously submitted request
   */
  async getStatus(requestId: string): Promise<ProcessResponseMessage> {
    const request: GetStatusRequest = { id: requestId }
    
    return new Promise((resolve, reject) => {
      this.client.getStatus(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Cancel a request that is currently being processed
   */
  async cancelRequest(requestId: string, reason?: string): Promise<CancelResponseMessage> {
    const request: CancelRequestMessage = { 
      id: requestId,
      reason: reason || 'Cancelled by client'
    }
    
    return new Promise((resolve, reject) => {
      this.client.cancelRequest(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Process a batch of requests
   */
  async processBatch(request: ProcessBatchRequestMessage): Promise<ProcessBatchResponseMessage> {
    return new Promise((resolve, reject) => {
      this.client.processBatch(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Get the status of a batch request
   */
  async getBatchStatus(batchId: string, includeResults = false): Promise<GetBatchStatusResponse> {
    const request: GetBatchStatusRequest = { 
      batch_id: batchId,
      include_results: includeResults
    }
    
    return new Promise((resolve, reject) => {
      this.client.getBatchStatus(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Get the current engine configuration
   */
  async getEngineConfig(): Promise<GetEngineConfigResponse> {
    const request: GetEngineConfigRequest = {}
    
    return new Promise((resolve, reject) => {
      this.client.getEngineConfig(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Update the engine configuration
   */
  async updateEngineConfig(request: UpdateEngineConfigRequest): Promise<UpdateEngineConfigResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateEngineConfig(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Get the current engine status
   */
  async getEngineStatus(): Promise<GetEngineStatusResponse> {
    const request: GetEngineStatusRequest = {}
    
    return new Promise((resolve, reject) => {
      this.client.getEngineStatus(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Get engine metrics for a specific time range
   */
  async getEngineMetrics(request: GetEngineMetricsRequest): Promise<GetEngineMetricsResponse> {
    return new Promise((resolve, reject) => {
      this.client.getEngineMetrics(request, this.metadata, (error, response) => {
        if (error) {
          reject(handleGrpcError(error))
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Close the gRPC client connection
   */
  close(): void {
    this.client.close()
  }
}
