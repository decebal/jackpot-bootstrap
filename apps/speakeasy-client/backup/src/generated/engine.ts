/* eslint-disable */
import * as grpc from '@grpc/grpc-js'
import * as Long from 'long'

// This is a mock implementation of what would be generated by ts-proto
// In a real implementation, this would be generated from the engine.proto file

export interface ProcessRequestMessage {
  id: string
  request_type: string
  data: Uint8Array
  timestamp: string
  metadata: { [key: string]: string }
  options?: ProcessingOptions | undefined
}

export interface ProcessingOptions {
  priority: number
  timeout: number
  async: boolean
  callback_url: string
  required_resources: string[]
}

export interface GetStatusRequest {
  id: string
}

export interface ProcessResponseMessage {
  id: string
  status: string
  result: Uint8Array
  timestamp: string
  success: boolean
  error: string
  metadata: { [key: string]: string }
  metrics?: ProcessingMetrics | undefined
}

export interface ProcessingMetrics {
  processing_time_ms: number
  queue_time_ms: number
  memory_used_mb: number
  cpu_usage_percent: number
}

export interface CancelRequestMessage {
  id: string
  reason: string
}

export interface CancelResponseMessage {
  success: boolean
  message: string
  error: string
}

export interface ProcessBatchRequestMessage {
  batch_id: string
  requests: ProcessRequestMessage[]
  options?: BatchProcessingOptions | undefined
}

export interface BatchProcessingOptions {
  fail_fast: boolean
  parallel: boolean
  max_concurrent: number
  timeout: number
}

export interface ProcessBatchResponseMessage {
  batch_id: string
  success: boolean
  status: string
  error: string
  total_requests: number
  completed_requests: number
  failed_requests: number
}

export interface GetBatchStatusRequest {
  batch_id: string
  include_results: boolean
}

export interface GetBatchStatusResponse {
  batch_id: string
  success: boolean
  status: string
  error: string
  total_requests: number
  completed_requests: number
  failed_requests: number
  results: ProcessResponseMessage[]
  metrics?: BatchProcessingMetrics | undefined
}

export interface BatchProcessingMetrics {
  total_processing_time_ms: number
  average_processing_time_ms: number
  max_processing_time_ms: number
  min_processing_time_ms: number
}

export interface GetEngineConfigRequest {
}

export interface GetEngineConfigResponse {
  success: boolean
  config?: EngineConfig | undefined
  error: string
}

export interface UpdateEngineConfigRequest {
  config?: EngineConfig | undefined
}

export interface UpdateEngineConfigResponse {
  success: boolean
  config?: EngineConfig | undefined
  error: string
}

export interface EngineConfig {
  max_concurrent_requests: number
  default_timeout: number
  max_request_size_bytes: number
  max_batch_size: number
  resource_limits: { [key: string]: string }
  feature_flags: { [key: string]: string }
}

export interface GetEngineStatusRequest {
}

export interface GetEngineStatusResponse {
  success: boolean
  status?: EngineStatus | undefined
  error: string
}

export interface EngineStatus {
  version: string
  status: string
  uptime_seconds: number
  active_requests: number
  queued_requests: number
  completed_requests: number
  failed_requests: number
  resources?: ResourceUtilization | undefined
  environment: { [key: string]: string }
}

export interface ResourceUtilization {
  cpu_usage_percent: number
  memory_usage_mb: number
  disk_usage_mb: number
  network_rx_kbps: number
  network_tx_kbps: number
}

export interface GetEngineMetricsRequest {
  start_time: string
  end_time: string
  metric_type: string
  resolution: number
}

export interface GetEngineMetricsResponse {
  success: boolean
  metrics: MetricPoint[]
  error: string
}

export interface MetricPoint {
  timestamp: string
  metric_name: string
  value: number
  labels: { [key: string]: string }
}

// Mock implementation of the EngineServiceClient
export class EngineServiceClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>
  ) {}

  processRequest(
    request: ProcessRequestMessage,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: ProcessResponseMessage) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  getStatus(
    request: GetStatusRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: ProcessResponseMessage) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  cancelRequest(
    request: CancelRequestMessage,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: CancelResponseMessage) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  processBatch(
    request: ProcessBatchRequestMessage,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: ProcessBatchResponseMessage) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  getBatchStatus(
    request: GetBatchStatusRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: GetBatchStatusResponse) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  getEngineConfig(
    request: GetEngineConfigRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: GetEngineConfigResponse) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  updateEngineConfig(
    request: UpdateEngineConfigRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: UpdateEngineConfigResponse) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  getEngineStatus(
    request: GetEngineStatusRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: GetEngineStatusResponse) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  getEngineMetrics(
    request: GetEngineMetricsRequest,
    metadata: grpc.Metadata,
    callback: (error: grpc.ServiceError | null, response: GetEngineMetricsResponse) => void
  ): grpc.ClientUnaryCall {
    return {} as grpc.ClientUnaryCall
  }

  close(): void {}
}
