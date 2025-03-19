import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column, Unique, JoinColumn } from 'typeorm';
import { Course } from 'src/courses/course.entity';
import { User } from 'src/user/user.entity';

@Entity('enrollments')
@Unique(['student', 'course']) // Prevent duplicate enrollments
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'studentId' }) // Explicit FK name
  student: User;

  @ManyToOne(() => Course, { nullable: false, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'courseId' }) // Explicit FK name
  course: Course;

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Allows unenrolling without deleting the record

  @CreateDateColumn()
  enrolledAt: Date;
}
