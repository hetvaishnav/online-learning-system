import { Controller, Post, Body, UseGuards, HttpException, HttpStatus, Get, Put, Param, Delete, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/couese.dto';
import { Roles } from 'src/shared/guard/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.entity';

@Controller('courses')
//@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.TEACHER)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.createCourse(createCourseDto);
  }
  @Roles(Role.ADMIN)
  @Get('allcourses')
  async getAllCourses() {
    try {
      const courses = await this.coursesService.getAllCourses();
      if (!courses.length) {
        throw new HttpException('No courses found', HttpStatus.NOT_FOUND);
      }
      return courses;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('teacher/:teacherId')
  async getCoursesByTeacher(@Param('teacherId') teacherId: string) {
    try {
      return await this.coursesService.getCoursesByTeacher(teacherId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      return await this.coursesService.updateCourse(id, updateCourseDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
async deleteCourse(@Param('id') id: string) {
  try {
    return await this.coursesService.deleteCourse(id);
  } catch (error) {
    throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Get('search')
async searchCourse(@Query('title')title:string):Promise<Course[]>{
  return this.coursesService.searchCourse(title)
}
}
