import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Lesson } from 'src/lessons/lesson.entity';
import { CourseVideo } from './course.video.entity';
import { ChatRoom } from '../chat/chat-room.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'category', length: 100, nullable: true })
  category?: string;

  @Column({ name: 'thumbnail', type: 'text', nullable: true })
  thumbnail?: string;

  @ManyToOne(() => User, (user) => user.courses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => CourseVideo, video => video.course, { cascade: true })
  videos: CourseVideo[];


  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({ name: 'isPublished', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ name: 'startDate', type: 'date' })
  startDate: Date;

  @Column({ name: 'endDate', type: 'date' })
  endDate: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[]

  @OneToMany(() => ChatRoom, chatRoom => chatRoom.course, { cascade: true })
  chatRooms: ChatRoom[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
