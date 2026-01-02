import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { ChatRoom } from './chat-room.entity';
import { User } from '../user/user.entity';
import { Course } from '../courses/course.entity';
import { Enrollment } from '../enrollments/enrollment.entity';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from 'src/shared/guard/websocket.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatRoom, User, Course, Enrollment]),
    AuthModule
  ],
  providers: [ChatService, ChatGateway, WsJwtGuard],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule { }
