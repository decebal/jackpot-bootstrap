import { Injectable } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class EngineValidator {
  private readonly requestSchema = z.object({
    id: z.string(),
    data: z.any(),
    timestamp: z.string().datetime().optional(),
  });

  async validateRequest(data: unknown) {
    return this.requestSchema.parseAsync(data);
  }
}
