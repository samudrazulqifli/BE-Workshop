import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateConsultationDto {
  @IsUUID()
  vehicleId: string;

  @IsUUID()
  mechanicId: string;

  @IsString()
  @IsNotEmpty()
  problemDescription: string;
}
