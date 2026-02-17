import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
export declare class ConsultationsController {
    private readonly consultationsService;
    constructor(consultationsService: ConsultationsService);
    create(user: any, dto: CreateConsultationDto): Promise<{
        consultationId: string;
        status: import("@prisma/client").$Enums.ConsultationStatus;
    }>;
    findAll(user: any): Promise<({
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
    })[]> | Promise<({
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
    findOne(user: any, id: string): Promise<{
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
    complete(user: any, id: string): Promise<{
        message: string;
        status: string;
    }>;
    cancel(user: any, id: string): Promise<{
        message: string;
        status: string;
    }>;
    uploadAttachment(user: any, id: string, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        consultationId: string;
        fileUrl: string;
    }>;
}
