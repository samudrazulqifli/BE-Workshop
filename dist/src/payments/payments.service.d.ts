import { PrismaService } from '../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPayment(userId: string, dto: CreatePaymentDto): Promise<{
        paymentId: string;
        amount: number;
        status: import("@prisma/client").$Enums.PaymentStatus;
        consultationStatus: string;
    }>;
    findByConsultation(consultationId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        consultationId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: number;
        paymentMethod: string | null;
    } | null>;
}
