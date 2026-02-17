import { PrismaService } from '../database/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        name: string;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    getAllMechanics(): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            isActive: boolean;
        };
        specialties: {
            specialty: string;
        }[];
        wallet: {
            balance: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        description: string | null;
        consultationFee: number;
        isVerified: boolean;
        isOnline: boolean;
    })[]>;
    verifyMechanic(mechanicId: string, adminId: string): Promise<{
        message: string;
    }>;
    suspendUser(userId: string, adminId: string): Promise<{
        message: string;
    }>;
    unsuspendUser(userId: string, adminId: string): Promise<{
        message: string;
    }>;
    getTransactions(): Promise<({
        user: {
            email: string;
            name: string;
        };
        consultation: {
            id: string;
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
            status: import("@prisma/client").$Enums.ConsultationStatus;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        consultationId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        amount: number;
        paymentMethod: string | null;
    })[]>;
    getAdminLogs(): Promise<({
        admin: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        action: string;
        targetId: string | null;
        adminId: string;
    })[]>;
}
