import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Course } from 'src/courses/course.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({name:"recipient_id"})
  recipient: User;  

  @ManyToOne(() => Course, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({name:"course_id"})
  course: Course; 

  @Column({ type: 'text' })
  message: string;  

  @Column({ type: 'boolean', default: false })
  isRead: boolean;  

  @CreateDateColumn()
  createdAt: Date;
}
