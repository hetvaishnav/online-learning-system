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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto'; // <-- IMPORT your DTO
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'; // Assuming you use this from your example
import { ConfigService } from '@nestjs/config';

// Define a type for our user payload to avoid using 'any'
interface AuthenticatedUserPayload {
  id: string; // or 'sub' depending on your JWT payload
  email: string;
  role: string;
  // add any other fields from your JWT payload
}

// Define a type for a socket that has the user attached
interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUserPayload;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*', methods: ['GET', 'POST'] }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

 

  // Inject ChatService and ConfigService
  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  // 1. AUTHENTICATION MIDDLEWARE (This is the correct way)
  // This runs for every new client trying to connect.
  afterInit(server: Server) {
    console.log('****** WebSocket server initialized ******');
    // Middleware should not be in afterInit for connection-time auth
  }

  handleConnection(client: Socket) {
    console.log(`****** Client connected: ${client.id} ******`);
  }

  handleDisconnect(client: Socket) {
    console.log(`****** Client disconnected: ${client.id} ******`);
  }

  @SubscribeMessage('joinCourseChat')
  handleJoinCourseChat(
    @MessageBody('courseId') courseId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (!courseId) {
      client.emit('error', new WsException('courseId is required.'));
      return;
    }
    console.log(`Client ${client.id} joining room for course: ${courseId}`);
    client.join(courseId);
    client.emit('joinedCourseChat', `Successfully joined chat for course: ${courseId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      console.log(`Message in course ${createChatDto.courseId}`);
      const message = await this.chatService.createMessage(createChatDto);
      this.server.to(createChatDto.courseId).emit('receiveMessage', message);
    } catch (error) {
        console.error(`Failed to send message: ${error.message}`, error.stack);
        client.emit('error', new WsException(error.message || 'Could not send message'));
    }
  }

  @SubscribeMessage('leaveCourseChat')
  handleLeaveCourseChat(
    @MessageBody('courseId') courseId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    if (!courseId) {
      client.emit('error', new WsException('courseId is required.'));
      return;
    }
    console.log(`Client ${client.id} left course chat: ${courseId}`);
    client.leave(courseId);
    client.emit('leftCourseChat', `Left chat for course: ${courseId}`);
  }
}
