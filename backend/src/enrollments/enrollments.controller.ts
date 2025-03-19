import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async enrollStudent(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.enrollStudent(createEnrollmentDto);
  }
}
