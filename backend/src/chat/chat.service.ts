import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
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
  ) {}

  async createMessage(createChatDto: CreateChatDto): Promise<Chat> {
    const { message, courseId, senderId } = createChatDto;

    const user = await this.userRepository.findOne({ where: { id: senderId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const course = await this.courseRepository.findOne({ 
      where: { id: courseId },
      relations: ['teacher'] 
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Verify the user is enrolled in the course or is the course teacher
    const enrollment = await this.enrollmentRepository.findOne({
      where: { student: { id: senderId }, course: { id: courseId } },
    });

    const isCourseTeacher = course.teacher.id === senderId;

    if (!enrollment && !isCourseTeacher) {
      throw new NotFoundException('User is not authorized to send messages in this course');
    }

    const newMessage = this.chatRepository.create({
      message,
      sender: user,
      course: course
    });

    return this.chatRepository.save(newMessage);
  }

  async getCourseChatMessages(courseId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { course: { id: courseId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' }
    });
  }
}
