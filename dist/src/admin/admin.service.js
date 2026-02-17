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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllMechanics() {
        return this.prisma.mechanic.findMany({
            include: {
                user: { select: { id: true, name: true, email: true, isActive: true } },
                specialties: { select: { specialty: true } },
                wallet: { select: { balance: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async verifyMechanic(mechanicId, adminId) {
        const mechanic = await this.prisma.mechanic.findUnique({
            where: { id: mechanicId },
        });
        if (!mechanic) {
            throw new common_1.NotFoundException('Mechanic not found');
        }
        await this.prisma.mechanic.update({
            where: { id: mechanicId },
            data: { isVerified: true },
        });
        await this.prisma.adminLog.create({
            data: {
                adminId,
                action: 'VERIFY_MECHANIC',
                targetId: mechanicId,
            },
        });
        return { message: 'Mechanic verified successfully' };
    }
    async suspendUser(userId, adminId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: false },
        });
        await this.prisma.adminLog.create({
            data: {
                adminId,
                action: 'SUSPEND_USER',
                targetId: userId,
            },
        });
        return { message: 'User suspended successfully' };
    }
    async unsuspendUser(userId, adminId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: true },
        });
        await this.prisma.adminLog.create({
            data: {
                adminId,
                action: 'UNSUSPEND_USER',
                targetId: userId,
            },
        });
        return { message: 'User unsuspended successfully' };
    }
    async getTransactions() {
        return this.prisma.payment.findMany({
            include: {
                user: { select: { name: true, email: true } },
                consultation: {
                    select: {
                        id: true,
                        status: true,
                        mechanic: {
                            include: {
                                user: { select: { name: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAdminLogs() {
        return this.prisma.adminLog.findMany({
            include: {
                admin: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map