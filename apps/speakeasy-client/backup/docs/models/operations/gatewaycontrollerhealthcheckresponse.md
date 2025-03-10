# GatewayControllerHealthCheckResponse

## Example Usage

```typescript
import { GatewayControllerHealthCheckResponse } from "jackpot-api-client/models/operations";

let value: GatewayControllerHealthCheckResponse = {
  contentType: "<value>",
  healthCheckResponse: {
    status: "ok",
    timestamp: "2025-03-07T13:15:43Z",
  },
  statusCode: 415,
  rawResponse: new Response("{\"message\": \"hello world\"}", {
    headers: { "Content-Type": "application/json" },
  }),
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `contentType`                                                            | *string*                                                                 | :heavy_check_mark:                                                       | HTTP response content type for this operation                            |
| `healthCheckResponse`                                                    | [shared.HealthCheckResponse](../../models/shared/healthcheckresponse.md) | :heavy_minus_sign:                                                       | Service is healthy                                                       |
| `statusCode`                                                             | *number*                                                                 | :heavy_check_mark:                                                       | HTTP response status code for this operation                             |
| `rawResponse`                                                            | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)    | :heavy_check_mark:                                                       | Raw HTTP response; suitable for custom response parsing                  |