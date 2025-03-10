import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CaptureRequestDto {
  @ApiProperty({
    description: 'The request object to capture',
    example: {
      url: 'https://api.example.com/endpoint',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { key: 'value' }
    },
  })
  @IsNotEmpty()
  @IsObject()
  request: Record<string, any>;

  @ApiProperty({
    description: 'The response object to capture',
    example: {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      data: { success: true, result: { key: 'value' } }
    },
  })
  @IsNotEmpty()
  @IsObject()
  response: Record<string, any>;

  @ApiProperty({
    description: 'Optional metadata for the request',
    example: { userId: '123', sessionId: 'abc-123', context: 'checkout' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
