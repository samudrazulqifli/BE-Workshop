import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    userRole?: string;
}
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private messagesService;
    server: Server;
    private userRooms;
    constructor(jwtService: JwtService, messagesService: MessagesService);
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        consultationId: string;
    }): Promise<void>;
    handleMessage(client: AuthenticatedSocket, data: {
        consultationId: string;
        type: string;
        content: string;
    }): Promise<void>;
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        consultationId: string;
    }): void;
    handleTyping(client: AuthenticatedSocket, data: {
        consultationId: string;
        isTyping: boolean;
    }): void;
}
export {};
