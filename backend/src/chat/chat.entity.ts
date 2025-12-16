import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../courses/course.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  message: string;

  @ManyToOne(() => User, user => user.chats)
  sender: User;

  @ManyToOne(() => Course, course => course.chats)
  course: Course;

  @CreateDateColumn()
  createdAt: Date;
}
