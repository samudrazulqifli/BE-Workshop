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
exports.ConsultationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let ConsultationsService = class ConsultationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const vehicle = await this.prisma.vehicle.findFirst({
            where: { id: dto.vehicleId, userId },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        const mechanic = await this.prisma.mechanic.findUnique({
            where: { id: dto.mechanicId },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Mechanic not found');
        }
        if (!mechanic.isVerified) {
            throw new common_1.BadRequestException('Mechanic is not verified');
        }
        if (!mechanic.isOnline) {
            throw new common_1.BadRequestException('Mechanic is currently offline');
        }
        const consultation = await this.prisma.consultation.create({
            data: {
                userId,
                mechanicId: dto.mechanicId,
                vehicleId: dto.vehicleId,
                problemDescription: dto.problemDescription,
                status: client_1.ConsultationStatus.PENDING,
            },
        });
        return {
            consultationId: consultation.id,
            status: consultation.status,
        };
    }
    async findById(id, userId, userRole) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true } },
                mechanic: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
                vehicle: true,
                attachments: true,
                payment: true,
                review: true,
            },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (userRole !== 'ADMIN' &&
            consultation.userId !== userId &&
            consultation.mechanic.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return consultation;
    }
    async findAllByUser(userId) {
        return this.prisma.consultation.findMany({
            where: { userId },
            include: {
                mechanic: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
                vehicle: true,
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAllByMechanic(userId) {
        const mechanic = await this.prisma.mechanic.findUnique({
            where: { userId },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Mechanic profile not found');
        }
        return this.prisma.consultation.findMany({
            where: { mechanicId: mechanic.id },
            include: {
                user: { select: { id: true, name: true } },
                vehicle: true,
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async complete(id, userId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id },
            include: {
                mechanic: true,
                payment: true,
            },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.userId !== userId) {
            throw new common_1.ForbiddenException('Only the consultation owner can complete it');
        }
        if (consultation.status !== client_1.ConsultationStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Cannot complete consultation with status: ${consultation.status}`);
        }
        await this.prisma.consultation.update({
            where: { id },
            data: { status: client_1.ConsultationStatus.COMPLETED },
        });
        if (consultation.payment) {
            await this.prisma.mechanicWallet.upsert({
                where: { mechanicId: consultation.mechanicId },
                update: {
                    balance: { increment: consultation.payment.amount },
                },
                create: {
                    mechanicId: consultation.mechanicId,
                    balance: consultation.payment.amount,
                },
            });
        }
        return { message: 'Consultation completed successfully', status: 'COMPLETED' };
    }
    async cancel(id, userId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.userId !== userId) {
            throw new common_1.ForbiddenException('Only the consultation owner can cancel it');
        }
        if (consultation.status !== client_1.ConsultationStatus.PENDING) {
            throw new common_1.BadRequestException('Can only cancel consultation before payment');
        }
        await this.prisma.consultation.update({
            where: { id },
            data: { status: client_1.ConsultationStatus.CANCELLED },
        });
        return { message: 'Consultation cancelled', status: 'CANCELLED' };
    }
    async addAttachment(consultationId, userId, fileUrl) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
        });
        if (!consultation) {
            throw new common_1.NotFoundException('Consultation not found');
        }
        if (consultation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.consultationAttachment.create({
            data: {
                consultationId,
                fileUrl,
            },
        });
    }
};
exports.ConsultationsService = ConsultationsService;
exports.ConsultationsService = ConsultationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsultationsService);
//# sourceMappingURL=consultations.service.js.map