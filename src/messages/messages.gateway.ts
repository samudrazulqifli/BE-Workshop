import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { MessageType } from '@prisma/client';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  namespace: '/ws/chat',
  cors: { origin: '*' },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Track which users are in which rooms
  private userRooms: Map<string, Set<string>> = new Map();

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
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
    } catch (error) {
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    // Clean up user rooms on disconnect
    if (client.userId) {
      this.userRooms.delete(client.userId);
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string },
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    const isValid = await this.messagesService.validateUserForConsultation(
      client.userId,
      data.consultationId,
    );

    if (!isValid) {
      client.emit('error', {
        message: 'Not authorized to join this consultation room',
      });
      return;
    }

    const roomName = `consultation:${data.consultationId}`;
    client.join(roomName);

    // Track rooms for this user
    if (!this.userRooms.has(client.userId)) {
      this.userRooms.set(client.userId, new Set());
    }
    this.userRooms.get(client.userId)!.add(roomName);

    // Send message history
    const messages = await this.messagesService.getMessagesByConsultation(
      data.consultationId,
    );
    client.emit('message_history', { messages });

    client.emit('room_joined', {
      consultationId: data.consultationId,
      message: 'Successfully joined room',
    });
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: { consultationId: string; type: string; content: string },
  ) {
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

    // Validate message type
    const messageType =
      data.type === 'IMAGE' ? MessageType.IMAGE : MessageType.TEXT;

    // Save to database
    const message = await this.messagesService.saveMessage(
      data.consultationId,
      client.userId,
      messageType,
      data.content,
    );

    // Broadcast to room
    this.server.to(roomName).emit('new_message', {
      id: message.id,
      senderId: client.userId,
      type: message.messageType,
      content: message.content,
      createdAt: message.createdAt,
    });
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string },
  ) {
    const roomName = `consultation:${data.consultationId}`;
    client.leave(roomName);

    const userRooms = this.userRooms.get(client.userId!);
    if (userRooms) {
      userRooms.delete(roomName);
    }

    client.emit('room_left', { consultationId: data.consultationId });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { consultationId: string; isTyping: boolean },
  ) {
    const roomName = `consultation:${data.consultationId}`;
    client.to(roomName).emit('typing', {
      userId: client.userId,
      isTyping: data.isTyping,
    });
  }
}
