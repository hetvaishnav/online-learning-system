import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from 'src/courses/course.entity';
import { User } from 'src/user/user.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Payment, PaymentStatus } from 'src/payment/payment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async enrollStudent(dto: CreateEnrollmentDto) {
    const { studentId, courseId } = dto;

    // Check if the student exists
    const student = await this.userRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    // Check if the course exists
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    console.log("course"+course?.id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    // Check if the student is already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({ where: { student, course } });
    if (existingEnrollment) {
      throw new BadRequestException(`Student is already enrolled in this course.`);
    }

    // If the course is paid, check if the student has completed the payment
    if (course.price > 0) {
      const payment = await this.paymentRepository.findOne({ where: { student:{id:student.id} , course:{id:course.id}, status: PaymentStatus.SUCCESS } });
      if (!payment) {
        throw new BadRequestException(`Payment required to enroll in this course.`);
      }
    }

    // Enroll the student
    const enrollment = this.enrollmentRepository.create({ student, course });
    return this.enrollmentRepository.save(enrollment);
  }
}
