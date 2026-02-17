import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateVehicleDto {
  @IsEnum(['MOTOR', 'MOBIL'])
  type: 'MOTOR' | 'MOBIL';

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number;
}
