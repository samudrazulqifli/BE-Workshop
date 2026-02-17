import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleType } from '@prisma/client';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        userId,
        type: dto.type as VehicleType,
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, userId },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async delete(id: string, userId: string) {
    const vehicle = await this.findById(id, userId);
    await this.prisma.vehicle.delete({ where: { id: vehicle.id } });
    return { message: 'Vehicle deleted successfully' };
  }
}
