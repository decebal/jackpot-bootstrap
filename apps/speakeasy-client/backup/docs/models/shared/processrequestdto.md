# ProcessRequestDto

## Example Usage

```typescript
import { ProcessRequestDto } from "jackpot-api-client/models/shared";

let value: ProcessRequestDto = {
  data: {},
  id: "req-123456",
  timestamp: "2025-03-07T13:15:43Z",
};
```

## Fields

| Field                                                 | Type                                                  | Required                                              | Description                                           | Example                                               |
| ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `data`                                                | [shared.Data](../../models/shared/data.md)            | :heavy_check_mark:                                    | Data payload to be processed                          | {<br/>"key": "value",<br/>"nested": {<br/>"property": "value"<br/>}<br/>} |
| `id`                                                  | *string*                                              | :heavy_check_mark:                                    | Unique identifier for the process request             | req-123456                                            |
| `timestamp`                                           | *string*                                              | :heavy_minus_sign:                                    | Optional timestamp for the request                    | 2025-03-07T13:15:43Z                                  |