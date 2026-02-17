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
exports.MechanicsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let MechanicsService = class MechanicsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(specialty, online) {
        const where = {};
        if (online === 'true') {
            where.isOnline = true;
        }
        if (specialty) {
            where.specialties = {
                some: { specialty },
            };
        }
        where.isVerified = true;
        const mechanics = await this.prisma.mechanic.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                specialties: {
                    select: { specialty: true },
                },
                reviews: {
                    select: { rating: true },
                },
            },
        });
        return mechanics.map((m) => ({
            id: m.id,
            userId: m.userId,
            name: m.user.name,
            description: m.description,
            specialties: m.specialties.map((s) => s.specialty),
            fee: m.consultationFee,
            isOnline: m.isOnline,
            rating: m.reviews.length > 0
                ? +(m.reviews.reduce((sum, r) => sum + r.rating, 0) / m.reviews.length).toFixed(1)
                : null,
            totalReviews: m.reviews.length,
        }));
    }
    async findById(id) {
        const mechanic = await this.prisma.mechanic.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                specialties: {
                    select: { specialty: true },
                },
                reviews: {
                    select: { rating: true, comment: true, createdAt: true },
                },
            },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Mechanic not found');
        }
        return {
            id: mechanic.id,
            userId: mechanic.userId,
            name: mechanic.user.name,
            description: mechanic.description,
            specialties: mechanic.specialties.map((s) => s.specialty),
            fee: mechanic.consultationFee,
            isOnline: mechanic.isOnline,
            isVerified: mechanic.isVerified,
            rating: mechanic.reviews.length > 0
                ? +(mechanic.reviews.reduce((sum, r) => sum + r.rating, 0) / mechanic.reviews.length).toFixed(1)
                : null,
            totalReviews: mechanic.reviews.length,
            reviews: mechanic.reviews,
        };
    }
    async updateProfile(userId, dto) {
        const mechanic = await this.prisma.mechanic.findUnique({
            where: { userId },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Mechanic profile not found');
        }
        await this.prisma.mechanic.update({
            where: { id: mechanic.id },
            data: {
                description: dto.description,
                consultationFee: dto.consultationFee,
            },
        });
        if (dto.specialties && dto.specialties.length > 0) {
            await this.prisma.mechanicSpecialty.deleteMany({
                where: { mechanicId: mechanic.id },
            });
            await this.prisma.mechanicSpecialty.createMany({
                data: dto.specialties.map((s) => ({
                    mechanicId: mechanic.id,
                    specialty: s,
                })),
            });
        }
        return this.findById(mechanic.id);
    }
    async updateStatus(userId, dto) {
        const mechanic = await this.prisma.mechanic.findUnique({
            where: { userId },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Mechanic profile not found');
        }
        if (!mechanic.isVerified) {
            throw new common_1.ForbiddenException('Mechanic is not verified yet');
        }
        await this.prisma.mechanic.update({
            where: { id: mechanic.id },
            data: { isOnline: dto.isOnline },
        });
        return { isOnline: dto.isOnline };
    }
};
exports.MechanicsService = MechanicsService;
exports.MechanicsService = MechanicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MechanicsService);
//# sourceMappingURL=mechanics.service.js.map