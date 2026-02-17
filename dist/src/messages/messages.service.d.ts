import { PrismaService } from '../database/prisma.service';
import { MessageType } from '@prisma/client';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    validateUserForConsultation(userId: string, consultationId: string): Promise<boolean>;
    saveMessage(consultationId: string, senderId: string, type: MessageType, content: string): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        content: string;
        senderId: string;
    }>;
    getMessagesByConsultation(consultationId: string): Promise<({
        sender: {
            id: string;
            role: import("@prisma/client").$Enums.Role;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        consultationId: string;
        messageType: import("@prisma/client").$Enums.MessageType;
        content: string;
        senderId: string;
    })[]>;
}
