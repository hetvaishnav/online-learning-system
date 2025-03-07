import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from 'src/courses/course.entity';

export enum LessonType {
  VIDEO = 'video',
  PDF = 'pdf',
  TEXT = 'text',
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'lessonOrder', type: 'int' })
  lessonOrder: number; // Order of the lesson within the course

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  course: Course; // Reference to the course this lesson belongs to

  @Column({ type: 'enum', enum: LessonType })
  contentType: LessonType; // Type of content (Video, PDF, Text)

  @Column({ name: 'contentUrl', type: 'text', nullable: true })
  contentUrl?: string; // Stores URL of video, PDF, or text content

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
