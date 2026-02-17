"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPayment(userId, dto) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: dto.consultationId },
            include: { mechanic: true, payment: true },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (consultation.status !== client_1.ConsultationStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot pay for consultation with status: ${consultation.status}`);
        }
        if (consultation.payment) {
            throw new common_1.BadRequestException('Payment already exists for this consultation');
        }
        const payment = await this.prisma.payment.create({
            data: {
                consultationId: dto.consultationId,
                userId,
                amount: consultation.mechanic.consultationFee,
                status: client_1.PaymentStatus.PAID,
                paymentMethod: dto.paymentMethod,
            },
        });
        await this.prisma.consultation.update({
            where: { id: dto.consultationId },
            data: { status: client_1.ConsultationStatus.ACTIVE },
        });
        return {
            paymentId: payment.id,
            amount: payment.amount,
            status: payment.status,
            consultationStatus: 'ACTIVE',
        };
    }
    async findByConsultation(consultationId) {
        return this.prisma.payment.findUnique({
            where: { consultationId },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map