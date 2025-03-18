import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson,LessonType } from './lesson.entity';
import { Course } from 'src/courses/course.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Multer } from 'multer';


@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async addLesson(createLessonDto: CreateLessonDto, file?: Multer.File): Promise<Lesson> {
    const { title, description, lessonOrder, courseId, contentType, contentUrl } = createLessonDto;

    // Check if course exists
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Ensure unique lesson order within a course
    const existingLesson = await this.lessonRepository.findOne({ where: { course, lessonOrder } });
    if (existingLesson) {
      throw new BadRequestException(`Lesson order ${lessonOrder} already exists in this course.`);
    }

    let storedContentUrl = contentUrl;
    
    if (contentType === LessonType.PDF) {
      if (!file) {
        throw new BadRequestException('PDF file is required for this lesson.');
      }
      storedContentUrl = `/uploads/pdfs/${file.filename}`; // Store local file path
    } else if (!contentUrl) {
      throw new BadRequestException(`A content URL is required for ${contentType} lessons.`);
    }

    // Create and save lesson
    const lesson = this.lessonRepository.create({
      title,
      description,
      lessonOrder,
      course,
      contentType,
      contentUrl: storedContentUrl,
    });

    return await this.lessonRepository.save(lesson);
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return this.lessonRepository.find({ where: { course: { id: courseId } } });
  }
  
}
