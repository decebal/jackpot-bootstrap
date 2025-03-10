# HealthCheckResponse

## Example Usage

```typescript
import { HealthCheckResponse } from "jackpot-api-client/models/shared";

let value: HealthCheckResponse = {
  status: "ok",
  timestamp: "2025-03-07T13:15:43Z",
};
```

## Fields

| Field                     | Type                      | Required                  | Description               | Example                   |
| ------------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------- |
| `status`                  | *string*                  | :heavy_check_mark:        | The status of the service | ok                        |
| `timestamp`               | *string*                  | :heavy_check_mark:        | The current timestamp     | 2025-03-07T13:15:43Z      |