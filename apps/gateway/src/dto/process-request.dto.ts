import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessRequestDto {
  @ApiProperty({
    description: 'Unique identifier for the process request',
    example: 'req-123456',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Data payload to be processed',
    example: { key: 'value', nested: { property: 'value' } },
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, unknown>;

  @ApiProperty({
    description: 'Optional timestamp for the request',
    example: '2025-03-07T13:15:43Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  timestamp?: string;
}
