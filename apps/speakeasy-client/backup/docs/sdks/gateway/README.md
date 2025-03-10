# Gateway
(*gateway*)

## Overview

### Available Operations

* [gatewayControllerGetEngineStatus](#gatewaycontrollergetenginestatus) - Get engine process status
* [gatewayControllerHealthCheck](#gatewaycontrollerhealthcheck) - Health check
* [gatewayControllerProcessEngineRequest](#gatewaycontrollerprocessenginerequest) - Process an engine request

## gatewayControllerGetEngineStatus

Retrieves the status of a previously submitted engine process request

### Example Usage

```typescript
import { JackpotAPI } from "jackpot-api-client";

const jackpotAPI = new JackpotAPI();

async function run() {
  const result = await jackpotAPI.gateway.gatewayControllerGetEngineStatus("req-123456");

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { JackpotAPICore } from "jackpot-api-client/core.js";
import { gatewayGatewayControllerGetEngineStatus } from "jackpot-api-client/funcs/gatewayGatewayControllerGetEngineStatus.js";

// Use `JackpotAPICore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const jackpotAPI = new JackpotAPICore();

async function run() {
  const res = await gatewayGatewayControllerGetEngineStatus(jackpotAPI, "req-123456");

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result);
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    | Example                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                                                                                                                                                                           | *string*                                                                                                                                                                       | :heavy_check_mark:                                                                                                                                                             | The ID of the process request to check                                                                                                                                         | [object Object]                                                                                                                                                                |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |                                                                                                                                                                                |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |                                                                                                                                                                                |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |                                                                                                                                                                                |

### Response

**Promise\<[operations.GatewayControllerGetEngineStatusResponse](../../models/operations/gatewaycontrollergetenginestatusresponse.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.APIError | 4XX, 5XX        | \*/\*           |

## gatewayControllerHealthCheck

Check if the API gateway is running properly

### Example Usage

```typescript
import { JackpotAPI } from "jackpot-api-client";

const jackpotAPI = new JackpotAPI();

async function run() {
  const result = await jackpotAPI.gateway.gatewayControllerHealthCheck();

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { JackpotAPICore } from "jackpot-api-client/core.js";
import { gatewayGatewayControllerHealthCheck } from "jackpot-api-client/funcs/gatewayGatewayControllerHealthCheck.js";

// Use `JackpotAPICore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const jackpotAPI = new JackpotAPICore();

async function run() {
  const res = await gatewayGatewayControllerHealthCheck(jackpotAPI);

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result);
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GatewayControllerHealthCheckResponse](../../models/operations/gatewaycontrollerhealthcheckresponse.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.APIError | 4XX, 5XX        | \*/\*           |

## gatewayControllerProcessEngineRequest

Sends a request to the engine service for processing

### Example Usage

```typescript
import { JackpotAPI } from "jackpot-api-client";

const jackpotAPI = new JackpotAPI();

async function run() {
  const result = await jackpotAPI.gateway.gatewayControllerProcessEngineRequest({
    data: {},
    id: "req-123456",
    timestamp: "2025-03-07T13:15:43Z",
  });

  // Handle the result
  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { JackpotAPICore } from "jackpot-api-client/core.js";
import { gatewayGatewayControllerProcessEngineRequest } from "jackpot-api-client/funcs/gatewayGatewayControllerProcessEngineRequest.js";

// Use `JackpotAPICore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const jackpotAPI = new JackpotAPICore();

async function run() {
  const res = await gatewayGatewayControllerProcessEngineRequest(jackpotAPI, {
    data: {},
    id: "req-123456",
    timestamp: "2025-03-07T13:15:43Z",
  });

  if (!res.ok) {
    throw res.error;
  }

  const { value: result } = res;

  // Handle the result
  console.log(result);
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [shared.ProcessRequestDto](../../models/shared/processrequestdto.md)                                                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.GatewayControllerProcessEngineRequestResponse](../../models/operations/gatewaycontrollerprocessenginerequestresponse.md)\>**

### Errors

| Error Type      | Status Code     | Content Type    |
| --------------- | --------------- | --------------- |
| errors.APIError | 4XX, 5XX        | \*/\*           |