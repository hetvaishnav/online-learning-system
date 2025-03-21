import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Course } from 'src/courses/course.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  recipient: User;  

  @ManyToOne(() => Course, { nullable: false, onDelete: 'CASCADE' })
  course: Course; 

  @Column({ type: 'text' })
  message: string;  

  @Column({ type: 'boolean', default: false })
  isRead: boolean;  

  @CreateDateColumn()
  createdAt: Date;
}
