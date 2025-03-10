import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export class RegisterEndpointDto {
  @ApiProperty({
    description: 'The path of the endpoint to register',
    example: '/api/users',
  })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({
    description: 'The HTTP method of the endpoint',
    enum: HttpMethod,
    example: 'POST',
  })
  @IsEnum(HttpMethod)
  @IsNotEmpty()
  method: string;

  @ApiProperty({
    description: 'Description of the endpoint',
    example: 'Creates a new user',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Tags for categorizing the endpoint',
    example: ['users', 'auth'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
