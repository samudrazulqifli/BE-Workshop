import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ConsultationStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: dto.consultationId },
      include: { review: true },
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    if (consultation.userId !== userId) {
      throw new ForbiddenException('Only the consultation owner can submit a review');
    }

    if (consultation.status !== ConsultationStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed consultations');
    }

    if (consultation.review) {
      throw new ConflictException('Review already submitted for this consultation');
    }

    return this.prisma.review.create({
      data: {
        consultationId: dto.consultationId,
        userId,
        mechanicId: consultation.mechanicId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async findByMechanic(mechanicId: string) {
    return this.prisma.review.findMany({
      where: { mechanicId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
