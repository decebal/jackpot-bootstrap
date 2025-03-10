# Jackpot Engine gRPC SDK

This SDK provides a TypeScript/JavaScript client for interacting with the Jackpot Engine service via gRPC.

## Installation

```bash
npm install jackpot-engine-sdk
```

## Usage

### Basic Setup

```typescript
import { EngineClient } from 'jackpot-engine-sdk';

// Create a client instance
const client = new EngineClient({
  host: 'engine.jackpot.com',  // Replace with your engine service host
  port: 50051,                 // Replace with your engine service port
  apiKey: 'your-api-key',      // Optional: API key for authentication
  secure: true,                // Optional: Use TLS (default: false)
  timeout: 30000               // Optional: Timeout in milliseconds (default: 30000)
});
```

### Processing Requests

```typescript
// Method 1: Using the helper process method
async function processSimpleRequest() {
  try {
    const response = await client.process(
      'text-processing',                // Request type
      'Text content to be processed',   // Data (string, Buffer, or Uint8Array)
      {
        priority: 8,                    // Optional: Priority (1-10)
        timeout: 120,                   // Optional: Timeout in seconds
        async: false                    // Optional: Process asynchronously
      },
      {                                 // Optional: Additional metadata
        'source': 'web-client',
        'user-id': '12345'
      }
    );
    
    console.log('Request processed:', response);
  } catch (error) {
    console.error('Error processing request:', error);
  }
}

// Method 2: Creating and sending a request manually
import { createProcessRequest } from 'jackpot-engine-sdk';

async function processCustomRequest() {
  try {
    // Create a request
    const request = createProcessRequest(
      'image-processing',
      imageBuffer,  // Buffer containing image data
      {
        priority: 10,
        timeout: 300,
        async: true,
        callback_url: 'https://your-callback-url.com/webhook'
      }
    );
    
    // Add custom fields to the request if needed
    request.metadata['model'] = 'high-resolution';
    
    // Process the request
    const response = await client.processRequest(request);
    console.log('Request submitted:', response);
  } catch (error) {
    console.error('Error submitting request:', error);
  }
}
```

### Checking Request Status

```typescript
async function checkRequestStatus(requestId) {
  try {
    const status = await client.getStatus(requestId);
    console.log('Request status:', status);
    return status;
  } catch (error) {
    console.error('Error checking status:', error);
    throw error;
  }
}
```

### Cancelling Requests

```typescript
async function cancelRequest(requestId) {
  try {
    const result = await client.cancelRequest(requestId, 'User cancelled the operation');
    console.log('Cancel result:', result);
    return result.success;
  } catch (error) {
    console.error('Error cancelling request:', error);
    return false;
  }
}
```

### Batch Processing

```typescript
import { createProcessRequest } from 'jackpot-engine-sdk';

async function processBatch() {
  try {
    // Create multiple requests
    const request1 = createProcessRequest('text-processing', 'Text 1');
    const request2 = createProcessRequest('text-processing', 'Text 2');
    const request3 = createProcessRequest('text-processing', 'Text 3');
    
    // Process as a batch
    const batchResponse = await client.processBatch({
      batch_id: `batch_${Date.now()}`,
      requests: [request1, request2, request3],
      options: {
        fail_fast: false,
        parallel: true,
        max_concurrent: 3,
        timeout: 600
      }
    });
    
    console.log('Batch submitted:', batchResponse);
    
    // Check batch status
    const batchStatus = await client.getBatchStatus(batchResponse.batch_id, true);
    console.log('Batch status:', batchStatus);
  } catch (error) {
    console.error('Error with batch processing:', error);
  }
}
```

### Engine Configuration and Status

```typescript
// Get engine configuration
async function getEngineConfig() {
  try {
    const config = await client.getEngineConfig();
    console.log('Engine configuration:', config);
    return config;
  } catch (error) {
    console.error('Error getting engine config:', error);
    throw error;
  }
}

// Update engine configuration
async function updateEngineConfig() {
  try {
    const response = await client.updateEngineConfig({
      config: {
        max_concurrent_requests: 20,
        default_timeout: 120,
        max_request_size_bytes: 10485760, // 10MB
        max_batch_size: 50,
        resource_limits: {
          'memory': '4G',
          'cpu': '2'
        },
        feature_flags: {
          'enable_advanced_processing': 'true',
          'use_gpu': 'true'
        }
      }
    });
    
    console.log('Engine configuration updated:', response);
  } catch (error) {
    console.error('Error updating engine config:', error);
  }
}

// Get engine status
async function getEngineStatus() {
  try {
    const status = await client.getEngineStatus();
    console.log('Engine status:', status);
    return status;
  } catch (error) {
    console.error('Error getting engine status:', error);
    throw error;
  }
}
```

### Metrics

```typescript
async function getEngineMetrics() {
  try {
    const metrics = await client.getEngineMetrics({
      start_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      end_time: new Date().toISOString(),
      metric_type: 'performance',
      resolution: 60 // 1 minute resolution
    });
    
    console.log('Engine metrics:', metrics);
    return metrics;
  } catch (error) {
    console.error('Error getting engine metrics:', error);
    throw error;
  }
}
```

### Cleanup

Always close the client when you're done to release resources:

```typescript
// Close the client connection when done
client.close();
```

## Error Handling

The SDK provides enhanced error handling with detailed gRPC error information:

```typescript
import { EngineClientError, statusCodeToString } from 'jackpot-engine-sdk';

try {
  const response = await client.processRequest(request);
  // Handle successful response
} catch (error) {
  if (error instanceof EngineClientError) {
    console.error(`gRPC error: ${statusCodeToString(error.code)}`);
    console.error(`Details: ${error.details}`);
    // Handle specific error codes
    switch (error.code) {
      case grpc.status.UNAVAILABLE:
        console.error('Engine service is unavailable, retry later');
        break;
      case grpc.status.DEADLINE_EXCEEDED:
        console.error('Request timed out');
        break;
      case grpc.status.UNAUTHENTICATED:
        console.error('Authentication failed, check your API key');
        break;
      default:
        console.error('Unexpected error occurred');
    }
  } else {
    console.error('Non-gRPC error:', error);
  }
}
```

## Environment Variables

The SDK can be configured using environment variables:

```
ENGINE_HOST=engine.jackpot.com
ENGINE_PORT=50051
ENGINE_API_KEY=your-api-key
ENGINE_SECURE=true
ENGINE_TIMEOUT=30000
```

Example of loading from environment:

```typescript
import { EngineClient } from 'jackpot-engine-sdk';

const client = new EngineClient({
  host: process.env.ENGINE_HOST || 'localhost',
  port: parseInt(process.env.ENGINE_PORT || '50051', 10),
  apiKey: process.env.ENGINE_API_KEY,
  secure: process.env.ENGINE_SECURE === 'true',
  timeout: parseInt(process.env.ENGINE_TIMEOUT || '30000', 10)
});
```

## TypeScript Support

This SDK is built with TypeScript and provides full type definitions for all methods and objects.
