# EngineProcessResponse

## Example Usage

```typescript
import { EngineProcessResponse } from "jackpot-api-client/models/shared";

let value: EngineProcessResponse = {
  error: "Failed to process request",
  id: "req-123456",
  result: {},
  success: true,
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         | Example                                             |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `error`                                             | *string*                                            | :heavy_minus_sign:                                  | Error message if processing failed                  | Failed to process request                           |
| `id`                                                | *string*                                            | :heavy_check_mark:                                  | The ID of the processed request                     | req-123456                                          |
| `result`                                            | [shared.Result](../../models/shared/result.md)      | :heavy_check_mark:                                  | The result of the processing                        | {<br/>"processed": true,<br/>"data": {<br/>"key": "value"<br/>}<br/>} |
| `success`                                           | *boolean*                                           | :heavy_check_mark:                                  | Indicates if the request was processed successfully | true                                                |