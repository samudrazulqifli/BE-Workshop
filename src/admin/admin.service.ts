import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllMechanics() {
    return this.prisma.mechanic.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, isActive: true } },
        specialties: { select: { specialty: true } },
        wallet: { select: { balance: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyMechanic(mechanicId: string, adminId: string) {
    const mechanic = await this.prisma.mechanic.findUnique({
      where: { id: mechanicId },
    });

    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }

    await this.prisma.mechanic.update({
      where: { id: mechanicId },
      data: { isVerified: true },
    });

    // Log admin action
    await this.prisma.adminLog.create({
      data: {
        adminId,
        action: 'VERIFY_MECHANIC',
        targetId: mechanicId,
      },
    });

    return { message: 'Mechanic verified successfully' };
  }

  async suspendUser(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    // Log admin action
    await this.prisma.adminLog.create({
      data: {
        adminId,
        action: 'SUSPEND_USER',
        targetId: userId,
      },
    });

    return { message: 'User suspended successfully' };
  }

  async unsuspendUser(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    await this.prisma.adminLog.create({
      data: {
        adminId,
        action: 'UNSUSPEND_USER',
        targetId: userId,
      },
    });

    return { message: 'User unsuspended successfully' };
  }

  async getTransactions() {
    return this.prisma.payment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        consultation: {
          select: {
            id: true,
            status: true,
            mechanic: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdminLogs() {
    return this.prisma.adminLog.findMany({
      include: {
        admin: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
