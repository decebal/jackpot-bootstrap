"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineClientError = void 0;
exports.createProcessRequest = createProcessRequest;
exports.handleGrpcError = handleGrpcError;
exports.statusCodeToString = statusCodeToString;
const grpc = __importStar(require("@grpc/grpc-js"));
/**
 * Error class for Engine client errors
 */
class EngineClientError extends Error {
    constructor(error) {
        super(error.message);
        this.name = 'EngineClientError';
        this.code = error.code;
        this.details = error.details;
        this.metadata = error.metadata;
    }
}
exports.EngineClientError = EngineClientError;
/**
 * Helper function to create a ProcessRequestMessage
 */
function createProcessRequest(requestType, data, options, metadata) {
    // Generate a unique ID for the request
    const id = generateRequestId();
    // Convert string data to Buffer if needed
    const bufferData = typeof data === 'string'
        ? Buffer.from(data)
        : data;
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
    };
}
/**
 * Generate a unique request ID
 */
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
/**
 * Helper function to handle gRPC errors
 */
function handleGrpcError(error) {
    if (error instanceof Error) {
        if ('code' in error && typeof error.code === 'number') {
            throw new EngineClientError(error);
        }
        throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
}
/**
 * Convert status code to human-readable message
 */
function statusCodeToString(code) {
    const statusMap = {
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
    };
    return statusMap[code] || `Unknown status code: ${code}`;
}
//# sourceMappingURL=engine-utils.js.map