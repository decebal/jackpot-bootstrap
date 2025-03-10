# EngineStatusResponse

## Example Usage

```typescript
import { EngineStatusResponse } from "jackpot-api-client/models/shared";

let value: EngineStatusResponse = {
  error: "Failed to process request",
  id: "req-123456",
  result: {},
  status: "completed",
  success: true,
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            | Example                                                                                |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `error`                                                                                | *string*                                                                               | :heavy_minus_sign:                                                                     | Error message if processing failed                                                     | Failed to process request                                                              |
| `id`                                                                                   | *string*                                                                               | :heavy_check_mark:                                                                     | The ID of the request                                                                  | req-123456                                                                             |
| `result`                                                                               | [shared.EngineStatusResponseResult](../../models/shared/enginestatusresponseresult.md) | :heavy_minus_sign:                                                                     | The result of the processing if completed                                              | {<br/>"processed": true,<br/>"data": {<br/>"key": "value"<br/>}<br/>}                  |
| `status`                                                                               | [shared.Status](../../models/shared/status.md)                                         | :heavy_check_mark:                                                                     | The current status of the request                                                      | completed                                                                              |
| `success`                                                                              | *boolean*                                                                              | :heavy_check_mark:                                                                     | Indicates if the status check was successful                                           | true                                                                                   |