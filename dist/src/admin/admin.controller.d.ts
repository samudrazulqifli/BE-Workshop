import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    verifyMechanic(id: string, admin: any): Promise<{
        message: string;
    }>;
    suspendUser(id: string, admin: any): Promise<{
        message: string;
    }>;
    unsuspendUser(id: string, admin: any): Promise<{
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
