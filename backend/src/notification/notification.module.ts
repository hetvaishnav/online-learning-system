import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Course } from 'src/courses/course.entity';
import { Enrollment } from 'src/enrollments/enrollment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/user/user.entity';
@Module({
  imports:  [TypeOrmModule.forFeature([Notification, Course, Enrollment,User])],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
