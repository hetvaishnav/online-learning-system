import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Course } from 'src/courses/course.entity';
import { Enrollment } from 'src/enrollments/enrollment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
@Module({
  imports:  [TypeOrmModule.forFeature([Notification, Course, Enrollment])],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
