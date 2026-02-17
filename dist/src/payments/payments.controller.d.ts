import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(user: any, dto: CreatePaymentDto): Promise<{
        paymentId: string;
        amount: number;
        status: import("@prisma/client").$Enums.PaymentStatus;
        consultationStatus: string;
    }>;
}
