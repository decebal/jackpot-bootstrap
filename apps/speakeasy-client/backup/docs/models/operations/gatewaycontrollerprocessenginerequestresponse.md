# GatewayControllerProcessEngineRequestResponse

## Example Usage

```typescript
import { GatewayControllerProcessEngineRequestResponse } from "jackpot-api-client/models/operations";

let value: GatewayControllerProcessEngineRequestResponse = {
  contentType: "<value>",
  engineProcessResponse: {
    error: "Failed to process request",
    id: "req-123456",
    result: {},
    success: true,
  },
  statusCode: 305,
  rawResponse: new Response("{\"message\": \"hello world\"}", {
    headers: { "Content-Type": "application/json" },
  }),
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `contentType`                                                                | *string*                                                                     | :heavy_check_mark:                                                           | HTTP response content type for this operation                                |
| `engineProcessResponse`                                                      | [shared.EngineProcessResponse](../../models/shared/engineprocessresponse.md) | :heavy_minus_sign:                                                           | Request processed successfully                                               |
| `statusCode`                                                                 | *number*                                                                     | :heavy_check_mark:                                                           | HTTP response status code for this operation                                 |
| `rawResponse`                                                                | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)        | :heavy_check_mark:                                                           | Raw HTTP response; suitable for custom response parsing                      |