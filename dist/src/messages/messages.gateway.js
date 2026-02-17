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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const messages_service_1 = require("./messages.service");
const client_1 = require("@prisma/client");
let MessagesGateway = class MessagesGateway {
    jwtService;
    messagesService;
    server;
    userRooms = new Map();
    constructor(jwtService, messagesService) {
        this.jwtService = jwtService;
        this.messagesService = messagesService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                client.emit('error', { message: 'Authentication required' });
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            client.userId = payload.sub;
            client.userRole = payload.role;
            client.emit('auth_success', {
                userId: payload.sub,
                role: payload.role,
            });
        }
        catch (error) {
            client.emit('error', { message: 'Invalid token' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            this.userRooms.delete(client.userId);
        }
    }
    async handleJoinRoom(client, data) {
        if (!client.userId) {
            client.emit('error', { message: 'Not authenticated' });
            return;
        }
        const isValid = await this.messagesService.validateUserForConsultation(client.userId, data.consultationId);
        if (!isValid) {
            client.emit('error', {
                message: 'Not authorized to join this consultation room',
            });
            return;
        }
        const roomName = `consultation:${data.consultationId}`;
        client.join(roomName);
        if (!this.userRooms.has(client.userId)) {
            this.userRooms.set(client.userId, new Set());
        }
        this.userRooms.get(client.userId).add(roomName);
        const messages = await this.messagesService.getMessagesByConsultation(data.consultationId);
        client.emit('message_history', { messages });
        client.emit('room_joined', {
            consultationId: data.consultationId,
            message: 'Successfully joined room',
        });
    }
    async handleMessage(client, data) {
        if (!client.userId) {
            client.emit('error', { message: 'Not authenticated' });
            return;
        }
        const roomName = `consultation:${data.consultationId}`;
        const userRooms = this.userRooms.get(client.userId);
        if (!userRooms || !userRooms.has(roomName)) {
            client.emit('error', { message: 'You must join the room first' });
            return;
        }
        const messageType = data.type === 'IMAGE' ? client_1.MessageType.IMAGE : client_1.MessageType.TEXT;
        const message = await this.messagesService.saveMessage(data.consultationId, client.userId, messageType, data.content);
        this.server.to(roomName).emit('new_message', {
            id: message.id,
            senderId: client.userId,
            type: message.messageType,
            content: message.content,
            createdAt: message.createdAt,
        });
    }
    handleLeaveRoom(client, data) {
        const roomName = `consultation:${data.consultationId}`;
        client.leave(roomName);
        const userRooms = this.userRooms.get(client.userId);
        if (userRooms) {
            userRooms.delete(roomName);
        }
        client.emit('room_left', { consultationId: data.consultationId });
    }
    handleTyping(client, data) {
        const roomName = `consultation:${data.consultationId}`;
        client.to(roomName).emit('typing', {
            userId: client.userId,
            isTyping: data.isTyping,
        });
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleTyping", null);
exports.MessagesGateway = MessagesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/ws/chat',
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        messages_service_1.MessagesService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map