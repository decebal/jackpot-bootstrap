import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ProcessRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsObject()
  @IsNotEmpty()
  data: Record<string, unknown>;

  @IsString()
  @IsOptional()
  timestamp?: string;
}
