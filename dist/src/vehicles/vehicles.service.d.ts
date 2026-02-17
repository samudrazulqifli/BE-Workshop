import { PrismaService } from '../database/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehiclesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateVehicleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VehicleType;
        brand: string;
        model: string;
        year: number;
        userId: string;
    }>;
    findAllByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VehicleType;
        brand: string;
        model: string;
        year: number;
        userId: string;
    }[]>;
    findById(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VehicleType;
        brand: string;
        model: string;
        year: number;
        userId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
}
