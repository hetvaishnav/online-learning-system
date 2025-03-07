import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Course } from 'src/courses/course.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Lesson,Course])],
  controllers: [LessonsController],
  providers: [LessonsService]
})
export class LessonsModule {}
