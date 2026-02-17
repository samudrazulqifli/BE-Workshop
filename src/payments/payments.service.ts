import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConsultationStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPayment(userId: string, dto: CreatePaymentDto) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: dto.consultationId },
      include: { mechanic: true, payment: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException(
        `Cannot pay for consultation with status: ${consultation.status}`,
      );
    }

    if (consultation.payment) {
      throw new BadRequestException('Payment already exists for this consultation');
    }

    // In MVP, payment is simulated — directly mark as PAID
    const payment = await this.prisma.payment.create({
      data: {
        consultationId: dto.consultationId,
        userId,
        amount: consultation.mechanic.consultationFee,
        status: PaymentStatus.PAID,
        paymentMethod: dto.paymentMethod,
      },
    });

    // Update consultation status to ACTIVE (skipping PAID state since payment is instant in MVP)
    await this.prisma.consultation.update({
      where: { id: dto.consultationId },
      data: { status: ConsultationStatus.ACTIVE },
    });

    return {
      paymentId: payment.id,
      amount: payment.amount,
      status: payment.status,
      consultationStatus: 'ACTIVE',
    };
  }

  async findByConsultation(consultationId: string) {
    return this.prisma.payment.findUnique({
      where: { consultationId },
    });
  }
}
