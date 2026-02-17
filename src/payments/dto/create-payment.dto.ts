import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  consultationId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
