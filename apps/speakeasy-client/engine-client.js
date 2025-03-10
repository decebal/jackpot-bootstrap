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
exports.EngineClient = exports.EngineClientError = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const engine_1 = require("./generated/engine");
const engine_utils_1 = require("./engine-utils");
class EngineClientError extends Error {
    constructor(message, code, details, metadata) {
        super(message);
        this.name = 'EngineClientError';
        if (code) {
            this.code = code;
        }
        if (details) {
            this.details = details;
        }
        if (metadata) {
            this.metadata = metadata;
        }
    }
}
exports.EngineClientError = EngineClientError;
class EngineClient {
    constructor(config) {
        const { host, port, apiKey, secure = false, timeout = 30000 } = config;
        const address = `${host}:${port}`;
        // Create gRPC client with timeout
        this.client = new engine_1.EngineServiceClient(address, secure
            ? grpc.credentials.createSsl()
            : grpc.credentials.createInsecure(), {
            'grpc.keepalive_timeout_ms': timeout
        });
        // Setup metadata for authentication
        this.metadata = new grpc.Metadata();
        if (apiKey) {
            this.metadata.add('x-api-key', apiKey);
        }
    }
    /**
     * Process a request through the engine
     */
    async processRequest(request) {
        return new Promise((resolve, reject) => {
            this.client.processRequest(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Helper method to create and process a request in one step
     */
    async process(requestType, data, options, metadata) {
        const request = (0, engine_utils_1.createProcessRequest)(requestType, data, options, metadata);
        return this.processRequest(request);
    }
    /**
     * Get the status of a previously submitted request
     */
    async getStatus(requestId) {
        const request = { id: requestId };
        return new Promise((resolve, reject) => {
            this.client.getStatus(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Cancel a request that is currently being processed
     */
    async cancelRequest(requestId, reason) {
        const request = {
            id: requestId,
            reason: reason || 'Cancelled by client'
        };
        return new Promise((resolve, reject) => {
            this.client.cancelRequest(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Process a batch of requests
     */
    async processBatch(request) {
        return new Promise((resolve, reject) => {
            this.client.processBatch(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Get the status of a batch request
     */
    async getBatchStatus(batchId, includeResults = false) {
        const request = {
            batch_id: batchId,
            include_results: includeResults
        };
        return new Promise((resolve, reject) => {
            this.client.getBatchStatus(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Get the current engine configuration
     */
    async getEngineConfig() {
        const request = {};
        return new Promise((resolve, reject) => {
            this.client.getEngineConfig(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Update the engine configuration
     */
    async updateEngineConfig(request) {
        return new Promise((resolve, reject) => {
            this.client.updateEngineConfig(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Get the current engine status
     */
    async getEngineStatus() {
        const request = {};
        return new Promise((resolve, reject) => {
            this.client.getEngineStatus(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Get engine metrics for a specific time range
     */
    async getEngineMetrics(request) {
        return new Promise((resolve, reject) => {
            this.client.getEngineMetrics(request, this.metadata, (error, response) => {
                if (error) {
                    reject((0, engine_utils_1.handleGrpcError)(error));
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    /**
     * Close the gRPC client connection
     */
    close() {
        this.client.close();
    }
}
exports.EngineClient = EngineClient;
//# sourceMappingURL=engine-client.js.map