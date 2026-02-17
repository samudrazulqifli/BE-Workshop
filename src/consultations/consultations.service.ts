import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { ConsultationStatus } from '@prisma/client';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateConsultationDto) {
    // Verify vehicle belongs to user
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: dto.vehicleId, userId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Verify mechanic exists, is verified, and is online
    const mechanic = await this.prisma.mechanic.findUnique({
      where: { id: dto.mechanicId },
    });
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }
    if (!mechanic.isVerified) {
      throw new BadRequestException('Mechanic is not verified');
    }
    if (!mechanic.isOnline) {
      throw new BadRequestException('Mechanic is currently offline');
    }

    const consultation = await this.prisma.consultation.create({
      data: {
        userId,
        mechanicId: dto.mechanicId,
        vehicleId: dto.vehicleId,
        problemDescription: dto.problemDescription,
        status: ConsultationStatus.PENDING,
      },
    });

    return {
      consultationId: consultation.id,
      status: consultation.status,
    };
  }

  async findById(id: string, userId: string, userRole: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        mechanic: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        vehicle: true,
        attachments: true,
        payment: true,
        review: true,
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Check ownership (user or mechanic can view)
    if (
      userRole !== 'ADMIN' &&
      consultation.userId !== userId &&
      consultation.mechanic.userId !== userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return consultation;
  }

  async findAllByUser(userId: string) {
    return this.prisma.consultation.findMany({
      where: { userId },
      include: {
        mechanic: {
          include: {
            user: { select: { name: true } },
          },
        },
        vehicle: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByMechanic(userId: string) {
    const mechanic = await this.prisma.mechanic.findUnique({
      where: { userId },
    });
    if (!mechanic) {
      throw new NotFoundException('Mechanic profile not found');
    }

    return this.prisma.consultation.findMany({
      where: { mechanicId: mechanic.id },
      include: {
        user: { select: { id: true, name: true } },
        vehicle: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async complete(id: string, userId: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: {
        mechanic: true,
        payment: true,
      },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Only the user who created the consultation can complete it
    if (consultation.userId !== userId) {
      throw new ForbiddenException('Only the consultation owner can complete it');
    }

    if (consultation.status !== ConsultationStatus.ACTIVE) {
      throw new BadRequestException(
        `Cannot complete consultation with status: ${consultation.status}`,
      );
    }

    // Update consultation status to COMPLETED
    await this.prisma.consultation.update({
      where: { id },
      data: { status: ConsultationStatus.COMPLETED },
    });

    // Transfer payment to mechanic wallet
    if (consultation.payment) {
      await this.prisma.mechanicWallet.upsert({
        where: { mechanicId: consultation.mechanicId },
        update: {
          balance: { increment: consultation.payment.amount },
        },
        create: {
          mechanicId: consultation.mechanicId,
          balance: consultation.payment.amount,
        },
      });
    }

    return { message: 'Consultation completed successfully', status: 'COMPLETED' };
  }

  async cancel(id: string, userId: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.userId !== userId) {
      throw new ForbiddenException('Only the consultation owner can cancel it');
    }

    // Can only cancel before PAID
    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException('Can only cancel consultation before payment');
    }

    await this.prisma.consultation.update({
      where: { id },
      data: { status: ConsultationStatus.CANCELLED },
    });

    return { message: 'Consultation cancelled', status: 'CANCELLED' };
  }

  async addAttachment(consultationId: string, userId: string, fileUrl: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.consultationAttachment.create({
      data: {
        consultationId,
        fileUrl,
      },
    });
  }
}
