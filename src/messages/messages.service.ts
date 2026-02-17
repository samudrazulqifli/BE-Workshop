import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConsultationStatus, MessageType } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async validateUserForConsultation(
    userId: string,
    consultationId: string,
  ): Promise<boolean> {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: consultationId },
      include: { mechanic: true },
    });

    if (!consultation) return false;
    if (consultation.status !== ConsultationStatus.ACTIVE) return false;

    // User must be either the consultation owner or the mechanic
    return (
      consultation.userId === userId || consultation.mechanic.userId === userId
    );
  }

  async saveMessage(
    consultationId: string,
    senderId: string,
    type: MessageType,
    content: string,
  ) {
    return this.prisma.message.create({
      data: {
        consultationId,
        senderId,
        messageType: type,
        content,
      },
    });
  }

  async getMessagesByConsultation(consultationId: string) {
    return this.prisma.message.findMany({
      where: { consultationId },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
