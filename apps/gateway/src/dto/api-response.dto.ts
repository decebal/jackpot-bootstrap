import { ApiProperty } from '@nestjs/swagger';

export class EngineProcessResponse {
  @ApiProperty({
    description: 'Indicates if the request was processed successfully',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'The ID of the processed request',
    example: 'req-123456',
  })
  id: string;

  @ApiProperty({
    description: 'The result of the processing',
    example: { processed: true, data: { key: 'value' } },
  })
  result?: Record<string, any>;

  @ApiProperty({
    description: 'Error message if processing failed',
    example: 'Failed to process request',
    required: false,
  })
  error?: string;
}

export class EngineStatusResponse {
  @ApiProperty({
    description: 'Indicates if the status check was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'The ID of the request',
    example: 'req-123456',
  })
  id: string;

  @ApiProperty({
    description: 'The current status of the request',
    example: 'completed',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status: string;

  @ApiProperty({
    description: 'The result of the processing if completed',
    example: { processed: true, data: { key: 'value' } },
    required: false,
  })
  result?: Record<string, any>;

  @ApiProperty({
    description: 'Error message if processing failed',
    example: 'Failed to process request',
    required: false,
  })
  error?: string;
}

export class HealthCheckResponse {
  @ApiProperty({
    description: 'The status of the service',
    example: 'ok',
  })
  status: string;

  @ApiProperty({
    description: 'The current timestamp',
    example: '2025-03-07T13:15:43Z',
  })
  timestamp: string;
}
