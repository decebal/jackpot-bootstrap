# GatewayControllerGetEngineStatusResponse

## Example Usage

```typescript
import { GatewayControllerGetEngineStatusResponse } from "jackpot-api-client/models/operations";

let value: GatewayControllerGetEngineStatusResponse = {
  contentType: "<value>",
  engineStatusResponse: {
    error: "Failed to process request",
    id: "req-123456",
    result: {},
    status: "completed",
    success: true,
  },
  statusCode: 306,
  rawResponse: new Response("{\"message\": \"hello world\"}", {
    headers: { "Content-Type": "application/json" },
  }),
};
```

## Fields

| Field                                                                      | Type                                                                       | Required                                                                   | Description                                                                |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `contentType`                                                              | *string*                                                                   | :heavy_check_mark:                                                         | HTTP response content type for this operation                              |
| `engineStatusResponse`                                                     | [shared.EngineStatusResponse](../../models/shared/enginestatusresponse.md) | :heavy_minus_sign:                                                         | Status retrieved successfully                                              |
| `statusCode`                                                               | *number*                                                                   | :heavy_check_mark:                                                         | HTTP response status code for this operation                               |
| `rawResponse`                                                              | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)      | :heavy_check_mark:                                                         | Raw HTTP response; suitable for custom response parsing                    |