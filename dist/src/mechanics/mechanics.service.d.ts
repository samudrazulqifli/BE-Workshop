import { PrismaService } from '../database/prisma.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
export declare class MechanicsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    updateProfile(userId: string, dto: CreateMechanicDto): Promise<{
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
    updateStatus(userId: string, dto: UpdateStatusDto): Promise<{
        isOnline: boolean;
    }>;
}
