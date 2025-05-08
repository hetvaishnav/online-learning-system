// course-video.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './course.entity';

@Entity('course_videos')
export class CourseVideo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  videoUrl: string;  

  @ManyToOne(() => Course, course => course.videos, { onDelete: 'CASCADE' })
  course: Course;
}
