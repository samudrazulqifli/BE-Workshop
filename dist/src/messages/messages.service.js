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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateUserForConsultation(userId, consultationId) {
        const consultation = await this.prisma.consultation.findUnique({
            where: { id: consultationId },
            include: { mechanic: true },
        });
        if (!consultation)
            return false;
        if (consultation.status !== client_1.ConsultationStatus.ACTIVE)
            return false;
        return (consultation.userId === userId || consultation.mechanic.userId === userId);
    }
    async saveMessage(consultationId, senderId, type, content) {
        return this.prisma.message.create({
            data: {
                consultationId,
                senderId,
                messageType: type,
                content,
            },
        });
    }
    async getMessagesByConsultation(consultationId) {
        return this.prisma.message.findMany({
            where: { consultationId },
            include: {
                sender: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map