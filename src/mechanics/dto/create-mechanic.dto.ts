import { IsOptional, IsString, IsNumber, IsArray, Min } from 'class-validator';

export class CreateMechanicDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  consultationFee: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specialties?: string[];
}
