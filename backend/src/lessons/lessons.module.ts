import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Course } from 'src/courses/course.entity';
import { BullModule } from '@nestjs/bull';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';
import { LessonsProcessor } from './lessons.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Course]),
    BullModule.registerQueue({
      name: 'lesson-notifications',
    }),
    EnrollmentsModule
  ],
  controllers: [LessonsController],
  providers: [LessonsService, LessonsProcessor]
})
export class LessonsModule { }
