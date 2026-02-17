import { PrismaService } from '../database/prisma.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
export declare class ConsultationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateConsultationDto): Promise<{
        consultationId: string;
        status: import("@prisma/client").$Enums.ConsultationStatus;
    }>;
    findById(id: string, userId: string, userRole: string): Promise<{
        mechanic: {
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            consultationFee: number;
            isVerified: boolean;
            isOnline: boolean;
        };
        user: {
            id: string;
            name: string;
        };
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.VehicleType;
            brand: string;
            model: string;
            year: number;
            userId: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            userId: string;
            consultationId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            paymentMethod: string | null;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            userId: string;
            mechanicId: string;
            consultationId: string;
            rating: number;
            comment: string | null;
        } | null;
        attachments: {
            id: string;
            createdAt: Date;
            consultationId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mechanicId: string;
        status: import("@prisma/client").$Enums.ConsultationStatus;
        vehicleId: string;
        problemDescription: string;
    }>;
    findAllByUser(userId: string): Promise<({
        mechanic: {
            user: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            description: string | null;
            consultationFee: number;
            isVerified: boolean;
            isOnline: boolean;
        };
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.VehicleType;
            brand: string;
            model: string;
            year: number;
            userId: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            userId: string;
            consultationId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            paymentMethod: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mechanicId: string;
        status: import("@prisma/client").$Enums.ConsultationStatus;
        vehicleId: string;
        problemDescription: string;
    })[]>;
    findAllByMechanic(userId: string): Promise<({
        user: {
            id: string;
            name: string;
        };
        vehicle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.VehicleType;
            brand: string;
            model: string;
            year: number;
            userId: string;
        };
        payment: {
            id: string;
            createdAt: Date;
            userId: string;
            consultationId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            paymentMethod: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mechanicId: string;
        status: import("@prisma/client").$Enums.ConsultationStatus;
        vehicleId: string;
        problemDescription: string;
    })[]>;
    complete(id: string, userId: string): Promise<{
        message: string;
        status: string;
    }>;
    cancel(id: string, userId: string): Promise<{
        message: string;
        status: string;
    }>;
    addAttachment(consultationId: string, userId: string, fileUrl: string): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        fileUrl: string;
    }>;
}
