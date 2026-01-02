import { Module } from '@nestjs/common';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from 'src/courses/course.entity';
import { User } from 'src/user/user.entity';
import { Payment } from 'src/payment/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Payment, User, Course])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService]
})
export class EnrollmentsModule { }
