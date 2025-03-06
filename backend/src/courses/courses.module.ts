import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Course,User])],
  controllers: [CoursesController],
  providers: [CoursesService]
})
export class CoursesModule {}
