import { MechanicsService } from './mechanics.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
export declare class MechanicsController {
    private readonly mechanicsService;
    constructor(mechanicsService: MechanicsService);
    findAll(specialty?: string, online?: string): Promise<{
        id: string;
        userId: string;
        name: string;
        description: string | null;
        specialties: string[];
        fee: number;
        isOnline: boolean;
        rating: number | null;
        totalReviews: number;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        userId: string;
        name: string;
        description: string | null;
        specialties: string[];
        fee: number;
        isOnline: boolean;
        isVerified: boolean;
        rating: number | null;
        totalReviews: number;
        reviews: {
            createdAt: Date;
            rating: number;
            comment: string | null;
        }[];
    }>;
    updateProfile(user: any, dto: CreateMechanicDto): Promise<{
        id: string;
        userId: string;
        name: string;
        description: string | null;
        specialties: string[];
        fee: number;
        isOnline: boolean;
        isVerified: boolean;
        rating: number | null;
        totalReviews: number;
        reviews: {
            createdAt: Date;
            rating: number;
            comment: string | null;
        }[];
    }>;
    updateStatus(user: any, dto: UpdateStatusDto): Promise<{
        isOnline: boolean;
    }>;
}
