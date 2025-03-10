# Jackpot Engine gRPC SDK

A TypeScript gRPC SDK client for direct, high-performance communication with the Jackpot Engine service.

## Overview

This package provides a type-safe gRPC client for the Jackpot Engine service, offering:

- High-performance direct communication with the Engine service
- Type-safe interfaces generated from Protocol Buffers
- Comprehensive API for all Engine service operations
- Robust error handling
- Batch processing capabilities
- Engine configuration and monitoring

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Access to the Jackpot Engine gRPC service

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Engine gRPC Configuration
ENGINE_HOST=localhost
ENGINE_PORT=50051
ENGINE_API_KEY=your_engine_api_key
ENGINE_SECURE=false
ENGINE_TIMEOUT=30000
```

### Installation

```bash
# Install the package
npm install jackpot-engine-sdk

# Or with Yarn
yarn add jackpot-engine-sdk

# Or with Bun
bun add jackpot-engine-sdk
```

### Development

If you're developing or contributing to the SDK:

```bash
# Install dependencies
npm install

# Generate gRPC TypeScript definitions
npm run proto:generate

# Build the package
npm run build

# Run tests
npm run test
```

## gRPC Engine SDK

The gRPC Engine SDK provides a high-performance, type-safe client for direct communication with the Engine service. For detailed documentation, see [ENGINE-SDK.md](./ENGINE-SDK.md).

### Basic Usage

```typescript
import { EngineClient } from 'jackpot-engine-sdk'

// Create a client instance
const client = new EngineClient({
	host: process.env.ENGINE_HOST || 'localhost',
	port: parseInt(process.env.ENGINE_PORT || '50051', 10),
	apiKey: process.env.ENGINE_API_KEY,
	secure: process.env.ENGINE_SECURE === 'true',
	timeout: parseInt(process.env.ENGINE_TIMEOUT || '30000', 10)
})

// Process a request
async function processRequest() {
	try {
		const response = await client.process(
			'text-processing',
			'Text content to be processed',
			{ priority: 5, timeout: 60 },
			{ 'source': 'web-client' }
		)
		console.log('Request processed:', response)
	} catch (error) {
		console.error('Error processing request:', error)
	} finally {
		// Always close the client when done
		client.close()
	}
}
```

### Key Features

- **High Performance**: Direct gRPC communication with the Engine service
- **Type Safety**: Full TypeScript definitions generated from Protocol Buffers
- **Comprehensive API**: Support for all Engine service operations
- **Robust Error Handling**: Detailed gRPC error information
- **Batch Processing**: Efficient handling of multiple requests
- **Monitoring**: Access to engine metrics and status

See the [examples directory](./src/examples/) for more usage examples.

## API Reference

The Engine gRPC SDK provides the following core methods:

### process

Processes a request through the Engine service.

```typescript
process(type: string, content: string, options?: ProcessOptions, metadata?: Record<string, string>): Promise<ProcessResponse>
```

### getStatus

Checks the status of a previously submitted request.

```typescript
getStatus(requestId: string, metadata?: Record<string, string>): Promise<StatusResponse>
```

### cancel

Cancels a running request.

```typescript
cancel(requestId: string, metadata?: Record<string, string>): Promise<CancelResponse>
```

### batchProcess

Processes multiple requests in a single batch.

```typescript
batchProcess(requests: BatchRequest[], metadata?: Record<string, string>): Promise<BatchResponse>
```

### close

Closes the gRPC client connection.

```typescript
close(): void
```
POST /speakeasy/forward/:path
```

Forwards a request to the Gateway service and captures it with Speakeasy.

Path parameter:
- `path`: The path to forward to the Gateway (e.g., `engine/process`)

Query parameters:
- `method`: HTTP method to use (default: POST)

Request body:
- The body to send to the Gateway

## Testing

```bash
# Run all tests
bun run test

# Run unit tests
bun run test:unit

# Run integration tests
bun run test:integration

# Run tests with coverage
bun run test:coverage
```

## Integration with Gateway

The Speakeasy client integrates with the Gateway service by:

1. Forwarding API requests to the Gateway
2. Capturing the requests and responses for Speakeasy analysis
3. Providing analytics and metrics for API usage

## Architecture

The application follows a modular architecture:

- **Controller**: Handles HTTP requests and routes
- **Service**: Contains business logic and coordinates between components
- **SpeakeasyApiService**: Manages the Speakeasy SDK integration
- **DTOs**: Define the data transfer objects for API requests and responses
- **Guards**: Implement authentication and authorization

## Contributing

1. Follow the project's coding standards and conventions
2. Write unit and integration tests for new features
3. Update documentation as needed

<!-- Start Summary [summary] -->
## Summary

Jackpot API: The Jackpot B2B platform API documentation
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [Speakeasy SDK Client](#speakeasy-sdk-client)
  * [Overview](#overview)
  * [Getting Started](#getting-started)
  * [API Endpoints](#api-endpoints)
  * [Testing](#testing)
  * [Integration with Gateway](#integration-with-gateway)
  * [Architecture](#architecture)
  * [Contributing](#contributing)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)

<!-- End Table of Contents [toc] -->

<!-- Start SDK Installation [installation] -->
## SDK Installation

> [!TIP]
> To finish publishing your SDK to npm and others you must [run your first generation action](https://www.speakeasy.com/docs/github-setup#step-by-step-guide).


The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add <UNSET>
```

### PNPM

```bash
pnpm add <UNSET>
```

### Bun

```bash
bun add <UNSET>
```

### Yarn

```bash
yarn add <UNSET> zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```

> [!NOTE]
> This package is published with CommonJS and ES Modules (ESM) support.
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { JackpotAPI } from "jackpot-api-client";

const jackpotAPI = new JackpotAPI();

async function run() {
  const result = await jackpotAPI.gateway.gatewayControllerGetEngineStatus(
    "req-123456",
  );

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [gateway](docs/sdks/gateway/README.md)

* [gatewayControllerGetEngineStatus](docs/sdks/gateway/README.md#gatewaycontrollergetenginestatus) - Get engine process status
* [gatewayControllerHealthCheck](docs/sdks/gateway/README.md#gatewaycontrollerhealthcheck) - Health check
* [gatewayControllerProcessEngineRequest](docs/sdks/gateway/README.md#gatewaycontrollerprocessenginerequest) - Process an engine request


</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`gatewayGatewayControllerGetEngineStatus`](docs/sdks/gateway/README.md#gatewaycontrollergetenginestatus) - Get engine process status
- [`gatewayGatewayControllerHealthCheck`](docs/sdks/gateway/README.md#gatewaycontrollerhealthcheck) - Health check
- [`gatewayGatewayControllerProcessEngineRequest`](docs/sdks/gateway/README.md#gatewaycontrollerprocessenginerequest) - Process an engine request

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { JackpotAPI } from "jackpot-api-client";

const jackpotAPI = new JackpotAPI();

async function run() {
  const result = await jackpotAPI.gateway.gatewayControllerGetEngineStatus(
    "req-123456",
    {
      retries: {
        strategy: "backoff",
        backoff: {
          initialInterval: 1,
          maxInterval: 50,
          exponent: 1.1,
          maxElapsedTime: 100,
        },
        retryConnectionErrors: false,
      },
    },
  );

  // Handle the result
  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { JackpotAPI } from "jackpot-api-client";

const jackpotAPI = new JackpotAPI({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
});

async function run() {
  const result = await jackpotAPI.gateway.gatewayControllerGetEngineStatus(
    "req-123456",
  );

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

If the request fails due to, for example 4XX or 5XX status codes, it will throw a `APIError`.

| Error Type      | Status Code | Content Type |
| --------------- | ----------- | ------------ |
| errors.APIError | 4XX, 5XX    | \*/\*        |

```typescript
import { JackpotAPI } from "jackpot-api-client";
import { SDKValidationError } from "jackpot-api-client/models/errors";

const jackpotAPI = new JackpotAPI();

async function run() {
  let result;
  try {
    result = await jackpotAPI.gateway.gatewayControllerGetEngineStatus(
      "req-123456",
    );

    // Handle the result
    console.log(result);
  } catch (err) {
    switch (true) {
      // The server response does not match the expected SDK schema
      case (err instanceof SDKValidationError):
        {
          // Pretty-print will provide a human-readable multi-line error message
          console.error(err.pretty());
          // Raw value may also be inspected
          console.error(err.rawValue);
          return;
        }
        apierror.js;
      // Server returned an error status code or an unknown content type
      case (err instanceof APIError): {
        console.error(err.statusCode);
        console.error(err.rawResponse.body);
        return;
      }
      default: {
        // Other errors such as network errors, see HTTPClientErrors for more details
        throw err;
      }
    }
  }
}

run();

```

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The `SDKValidationError` that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted multi-line string since validation errors can list many issues and the plain error string may be difficult read when debugging.

In some rare cases, the SDK can fail to get a response from the server or even make the request due to unexpected circumstances such as network conditions. These types of errors are captured in the `models/errors/httpclienterrors.ts` module:

| HTTP Client Error                                    | Description                                          |
| ---------------------------------------------------- | ---------------------------------------------------- |
| RequestAbortedError                                  | HTTP request was aborted by the client               |
| RequestTimeoutError                                  | HTTP request timed out due to an AbortSignal signal  |
| ConnectionError                                      | HTTP client was unable to make a request to a server |
| InvalidRequestError                                  | Any input used to create a request is invalid        |
| UnexpectedClientError                                | Unrecognised or unexpected error                     |
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { JackpotAPI } from "jackpot-api-client";

const jackpotAPI = new JackpotAPI({
  serverURL: "http://localhost:3000",
});

async function run() {
  const result = await jackpotAPI.gateway.gatewayControllerGetEngineStatus(
    "req-123456",
  );

  // Handle the result
  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { JackpotAPI } from "jackpot-api-client";
import { HTTPClient } from "jackpot-api-client/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new JackpotAPI({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { JackpotAPI } from "jackpot-api-client";

const sdk = new JackpotAPI({ debugLogger: console });
```
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->
