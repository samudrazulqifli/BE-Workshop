import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(user: any, dto: CreateVehicleDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VehicleType;
        brand: string;
        model: string;
        year: number;
        userId: string;
    }>;
    findAll(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VehicleType;
        brand: string;
        model: string;
        year: number;
        userId: string;
    }[]>;
    findOne(user: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.VehicleType;
        brand: string;
        model: string;
        year: number;
        userId: string;
    }>;
    remove(user: any, id: string): Promise<{
        message: string;
    }>;
}
