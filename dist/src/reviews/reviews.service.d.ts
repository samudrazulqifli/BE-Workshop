import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        mechanicId: string;
        consultationId: string;
        rating: number;
        comment: string | null;
    }>;
    findByMechanic(mechanicId: string): Promise<({
        user: {
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        mechanicId: string;
        consultationId: string;
        rating: number;
        comment: string | null;
    })[]>;
}
