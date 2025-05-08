import { Controller, Post, Body, BadRequestException, Param, Get, NotFoundException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async enrollStudent(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.enrollStudent(createEnrollmentDto);
  }

  @Get('student/:studentId')
  async getEnrolledCourses(@Param('studentId') studentId: string) {
    const enrollments = await this.enrollmentsService.getEnrolledCoursesByStudent(studentId);
    if (!enrollments.length) {
      throw new NotFoundException(`No enrollments found for student ID: ${studentId}`);
    }
    return enrollments;
  }
  @Get('course/:courseId')
  async getEnrolledStudents(@Param('courseId') courseId: string) {
    const enrollments = await this.enrollmentsService.getEnrolledStudents(courseId);
    if (!enrollments.length) {
      throw new NotFoundException(`No enrollments found for courseId : ${courseId}`);
    }
    return enrollments;
  }
}
