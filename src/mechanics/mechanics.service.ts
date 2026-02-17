import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class MechanicsService {
  constructor(private prisma: PrismaService) {}

  async findAll(specialty?: string, online?: string) {
    const where: any = {};

    if (online === 'true') {
      where.isOnline = true;
    }

    if (specialty) {
      where.specialties = {
        some: { specialty },
      };
    }

    // Only show verified mechanics
    where.isVerified = true;

    const mechanics = await this.prisma.mechanic.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        specialties: {
          select: { specialty: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    return mechanics.map((m) => ({
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      description: m.description,
      specialties: m.specialties.map((s) => s.specialty),
      fee: m.consultationFee,
      isOnline: m.isOnline,
      rating:
        m.reviews.length > 0
          ? +(m.reviews.reduce((sum, r) => sum + r.rating, 0) / m.reviews.length).toFixed(1)
          : null,
      totalReviews: m.reviews.length,
    }));
  }

  async findById(id: string) {
    const mechanic = await this.prisma.mechanic.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        specialties: {
          select: { specialty: true },
        },
        reviews: {
          select: { rating: true, comment: true, createdAt: true },
        },
      },
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    return {
      id: mechanic.id,
      userId: mechanic.userId,
      name: mechanic.user.name,
      description: mechanic.description,
      specialties: mechanic.specialties.map((s) => s.specialty),
      fee: mechanic.consultationFee,
      isOnline: mechanic.isOnline,
      isVerified: mechanic.isVerified,
      rating:
        mechanic.reviews.length > 0
          ? +(mechanic.reviews.reduce((sum, r) => sum + r.rating, 0) / mechanic.reviews.length).toFixed(1)
          : null,
      totalReviews: mechanic.reviews.length,
      reviews: mechanic.reviews,
    };
  }

  async updateProfile(userId: string, dto: CreateMechanicDto) {
    const mechanic = await this.prisma.mechanic.findUnique({
      where: { userId },
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic profile not found');
    }

    // Update mechanic profile
    await this.prisma.mechanic.update({
      where: { id: mechanic.id },
      data: {
        description: dto.description,
        consultationFee: dto.consultationFee,
      },
    });

    // Replace specialties if provided
    if (dto.specialties && dto.specialties.length > 0) {
      await this.prisma.mechanicSpecialty.deleteMany({
        where: { mechanicId: mechanic.id },
      });

      await this.prisma.mechanicSpecialty.createMany({
        data: dto.specialties.map((s) => ({
          mechanicId: mechanic.id,
          specialty: s,
        })),
      });
    }

    return this.findById(mechanic.id);
  }

  async updateStatus(userId: string, dto: UpdateStatusDto) {
    const mechanic = await this.prisma.mechanic.findUnique({
      where: { userId },
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic profile not found');
    }

    if (!mechanic.isVerified) {
      throw new ForbiddenException('Mechanic is not verified yet');
    }

    await this.prisma.mechanic.update({
      where: { id: mechanic.id },
      data: { isOnline: dto.isOnline },
    });

    return { isOnline: dto.isOnline };
  }
}
