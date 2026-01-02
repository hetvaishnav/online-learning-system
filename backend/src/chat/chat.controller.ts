import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './chat.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post('send')
  async sendMessage(@Body() createChatDto: CreateChatDto, @Req() req): Promise<Chat> {
    createChatDto.senderId = req.user.id; // Corrected to use req.user.id based on JwtStrategy
    return this.chatService.createMessage(createChatDto);
  }

  @Get('course/:courseId')
  async getCourseChatMessages(@Param('courseId') courseId: string): Promise<Chat[]> {
    return this.chatService.getCourseChatMessages(courseId);
  }

  @Get('room/:courseId')
  async getChatRoom(@Param('courseId') courseId: string) {
    return this.chatService.ensureDefaultChatRoom(courseId);
  }
}
