import * as grpc from '@grpc/grpc-js';
import { ProcessRequestMessage, ProcessingOptions } from './generated/engine';
/**
 * Error class for Engine client errors
 */
export declare class EngineClientError extends Error {
    code: grpc.status;
    details?: string;
    metadata?: grpc.Metadata;
    constructor(error: grpc.ServiceError);
}
/**
 * Helper function to create a ProcessRequestMessage
 */
export declare function createProcessRequest(requestType: string, data: Buffer | Uint8Array | string, options?: Partial<ProcessingOptions>, metadata?: Record<string, string>): ProcessRequestMessage;
/**
 * Helper function to handle gRPC errors
 */
export declare function handleGrpcError(error: any): never;
/**
 * Convert status code to human-readable message
 */
export declare function statusCodeToString(code: grpc.status): string;
//# sourceMappingURL=engine-utils.d.ts.map