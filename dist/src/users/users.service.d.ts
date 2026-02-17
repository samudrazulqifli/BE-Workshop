import { PrismaService } from '../database/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        name: string;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        name: string;
        isActive: boolean;
        createdAt: Date;
    } | null>;
}
