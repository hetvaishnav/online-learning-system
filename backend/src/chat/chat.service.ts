import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { ChatRoom } from './chat-room.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from '../user/user.entity';
import { Course } from '../courses/course.entity';
import { Enrollment } from '../enrollments/enrollment.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) { }

  // Helper to ensure default room exists
  async ensureDefaultChatRoom(courseId: string): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: { course: { id: courseId }, name: 'General' },
    });

    if (chatRoom) return chatRoom;

    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');

    const newRoom = this.chatRoomRepository.create({
      name: 'General',
      course: course,
    });

    return this.chatRoomRepository.save(newRoom);
  }

  async createMessage(createChatDto: CreateChatDto): Promise<Chat> {
    const { message, courseId, senderId } = createChatDto;
    // Note: We are temporarily keeping courseId in DTO to find/create the default room.
    // In strict mode, DTO should have chatRoomId. For now, we infer it.

    const user = await this.userRepository.findOne({ where: { id: senderId } });
    if (!user) throw new NotFoundException('User not found');

    // Access Control check (Enrollment/Teacher)
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['teacher']
    });
    if (!course) throw new NotFoundException('Course not found');

    const enrollment = await this.enrollmentRepository.findOne({
      where: { student: { id: senderId }, course: { id: courseId } },
    });
    const isCourseTeacher = course.teacher.id === senderId;

    if (!enrollment && !isCourseTeacher) {
      throw new NotFoundException('User is not authorized to send messages in this course');
    }

    // Get or create the room
    const chatRoom = await this.ensureDefaultChatRoom(courseId);

    const newMessage = this.chatRepository.create({
      message,
      sender: user,
      chatRoom: chatRoom,
    });

    return this.chatRepository.save(newMessage);
  }

  // Updated to fetch by course -> default room
  async getCourseChatMessages(courseId: string): Promise<Chat[]> {
    const chatRoom = await this.ensureDefaultChatRoom(courseId);

    return this.chatRepository.find({
      where: { chatRoom: { id: chatRoom.id } },
      relations: ['sender', 'chatRoom'],
      order: { createdAt: 'ASC' }
    });
  }
}
