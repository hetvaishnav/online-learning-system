import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatEventEnum } from '../shared/enums/chat-events.enum';

interface AuthenticatedUserPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUserPayload;
}

@Injectable()
@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*', methods: ['GET', 'POST'] }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) { }

  afterInit(server: Server) {
    // Authentication middleware - runs before handleConnection
    server.use((socket: Socket, next) => {
      try {
        let token =
          socket.handshake.auth?.token ||
          socket.handshake.query?.token ||
          socket.handshake.headers?.authorization?.split(' ')[1];

        // Strip "Bearer " prefix if present
        if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
          token = token.slice(7).trim();
        }

        if (!token) {
          return next(new Error('Authentication error: Token missing'));
        }

        const payload = this.jwtService.verify(token) as AuthenticatedUserPayload;
        (socket as any).user = payload;
        next();
      } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  handleConnection(client: AuthenticatedSocket) {
    console.log(`****** Client connected: ${client.id} (User: ${client.user?.id}) ******`);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log(`****** Client disconnected: ${client.id} ******`);
  }

  @SubscribeMessage(ChatEventEnum.JOIN_COURSE_CHAT)
  handleJoinCourseChat(
    @MessageBody('courseId') courseId: string, // Keeping legacy name for now, but treating as Room ID or handling conversion?
    // User plan said: "Join the chatRoomId". So frontend will send chatRoomId.
    // Let's rename the arg to 'roomId' but keep event name or add a new event.
    // To cleanly refactor, let's use a new event or overload.
    // Given the constraints, I will assume frontend sends { courseId: chatRoomId } for this event, or I should rename the event in types.
    // Let's stick to the event enum `JOIN_COURSE_CHAT` but we will treat the payload as the ID to join.
    @MessageBody('chatRoomId') chatRoomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): void {
    const roomId = chatRoomId;
    if (!roomId) {
      client.emit(ChatEventEnum.ERROR, { message: 'chatRoomId is required' });
      return;
    }

    client.join(roomId);
    client.emit(ChatEventEnum.JOINED_COURSE_CHAT, {
      courseId: roomId, // Echo back
      message: `Successfully joined chat room: ${roomId}`
    });
  }

  @SubscribeMessage(ChatEventEnum.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    try {
      if (!client.user) {
        throw new WsException('Unauthorized');
      }

      createChatDto.senderId = client.user.id;
      const message = await this.chatService.createMessage(createChatDto);
      if (message.chatRoom) {
        this.server.to(message.chatRoom.id).emit(ChatEventEnum.RECEIVE_MESSAGE, message);
      }
    } catch (error) {
      console.error(`Failed to send message: ${error.message}`, error.stack);
      client.emit(ChatEventEnum.ERROR, {
        message: error.message || 'Could not send message'
      });
    }
  }

  @SubscribeMessage(ChatEventEnum.LEAVE_COURSE_CHAT)
  handleLeaveCourseChat(
    @MessageBody('chatRoomId') chatRoomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): void {
    if (!chatRoomId) {
      client.emit(ChatEventEnum.ERROR, { message: 'chatRoomId is required' });
      return;
    }

    client.leave(chatRoomId);
    client.emit(ChatEventEnum.LEFT_COURSE_CHAT, {
      courseId: chatRoomId,
      message: `Left chat room: ${chatRoomId}`
    });
  }

  // Helper methods for emitting events
  emitMessageToRoom(courseId: string, event: string, data: any) {
    this.server.to(courseId).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
