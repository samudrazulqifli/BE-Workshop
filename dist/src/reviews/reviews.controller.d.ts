import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(user: any, dto: CreateReviewDto): Promise<{
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
