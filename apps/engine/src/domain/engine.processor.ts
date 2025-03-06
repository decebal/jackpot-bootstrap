import { Injectable } from '@nestjs/common';
import { EngineValidator } from './engine.validator';
import { ProcessRequest, ProcessResponse } from './interfaces/engine.interface';

@Injectable()
export class EngineProcessor {
  constructor(private readonly validator: EngineValidator) {}

  async process(request: ProcessRequest): Promise<ProcessResponse> {
    // Validate request using Zod (following our validation standards)
    await this.validator.validateRequest(request);

    // Process the request using functional programming patterns
    const processedData = await this.processRequest(request);

    return {
      id: processedData.id,
      status: processedData.status,
      result: processedData.result,
      timestamp: new Date().toISOString(),
    };
  }

  private async processRequest(request: ProcessRequest): Promise<ProcessResponse> {
    // Implementation following functional programming principles
    const { data } = request;
    
    return {
      id: request.id,
      status: 'completed',
      result: data,
      timestamp: new Date().toISOString(),
    };
  }
}
