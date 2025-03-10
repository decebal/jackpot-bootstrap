import * as grpc from '@grpc/grpc-js'
import { ProcessRequestMessage, ProcessingOptions } from './generated/engine'

/**
 * Error class for Engine client errors
 */
export class EngineClientError extends Error {
  code: grpc.status
  details?: string
  metadata?: grpc.Metadata

  constructor(error: grpc.ServiceError) {
    super(error.message)
    this.name = 'EngineClientError'
    this.code = error.code
    this.details = error.details
    this.metadata = error.metadata
  }
}

/**
 * Helper function to create a ProcessRequestMessage
 */
export function createProcessRequest(
  requestType: string,
  data: Buffer | Uint8Array | string,
  options?: Partial<ProcessingOptions>,
  metadata?: Record<string, string>
): ProcessRequestMessage {
  // Generate a unique ID for the request
  const id = generateRequestId()
  
  // Convert string data to Buffer if needed
  const bufferData = typeof data === 'string' 
    ? Buffer.from(data) 
    : data

  return {
    id,
    request_type: requestType,
    data: bufferData,
    timestamp: new Date().toISOString(),
    metadata: metadata || {},
    options: {
      priority: options?.priority || 5,
      timeout: options?.timeout || 60,
      async: options?.async || false,
      callback_url: options?.callback_url || '',
      required_resources: options?.required_resources || []
    }
  }
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Helper function to handle gRPC errors
 */
export function handleGrpcError(error: any): never {
  if (error instanceof Error) {
    if ('code' in error && typeof error.code === 'number') {
      throw new EngineClientError(error as grpc.ServiceError)
    }
    throw error
  }
  throw new Error(`Unknown error: ${String(error)}`)
}

/**
 * Convert status code to human-readable message
 */
export function statusCodeToString(code: grpc.status): string {
  const statusMap: Record<number, string> = {
    [grpc.status.OK]: 'OK',
    [grpc.status.CANCELLED]: 'Cancelled',
    [grpc.status.UNKNOWN]: 'Unknown error',
    [grpc.status.INVALID_ARGUMENT]: 'Invalid argument',
    [grpc.status.DEADLINE_EXCEEDED]: 'Deadline exceeded',
    [grpc.status.NOT_FOUND]: 'Not found',
    [grpc.status.ALREADY_EXISTS]: 'Already exists',
    [grpc.status.PERMISSION_DENIED]: 'Permission denied',
    [grpc.status.RESOURCE_EXHAUSTED]: 'Resource exhausted',
    [grpc.status.FAILED_PRECONDITION]: 'Failed precondition',
    [grpc.status.ABORTED]: 'Aborted',
    [grpc.status.OUT_OF_RANGE]: 'Out of range',
    [grpc.status.UNIMPLEMENTED]: 'Unimplemented',
    [grpc.status.INTERNAL]: 'Internal error',
    [grpc.status.UNAVAILABLE]: 'Service unavailable',
    [grpc.status.DATA_LOSS]: 'Data loss',
    [grpc.status.UNAUTHENTICATED]: 'Unauthenticated',
  }
  
  return statusMap[code] || `Unknown status code: ${code}`
}
