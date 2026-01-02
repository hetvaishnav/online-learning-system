import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/courses/course.entity';
import { Enrollment } from 'src/enrollments/enrollment.entity';
import { Notification } from './notification.entity';
import { User } from 'src/user/user.entity';
@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        @InjectRepository(Enrollment)
        private readonly enrollmentRepository: Repository<Enrollment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async sendCourseUpdateNotification(dto: CreateNotificationDto): Promise<Notification[]> {
        const { courseId, message } = dto;
        const course = await this.courseRepository.findOne({ where: { id: courseId } })
        if (!course) {
            throw new NotFoundException("course not found")
        }

        const entrollments = await this.enrollmentRepository.find({ where: { course: { id: course.id } } })

        if (entrollments.length == 0) {
            throw new NotFoundException("No student found in this course")

        }
        const notification = entrollments.map((entrollment) =>
            this.notificationRepository.create({
                recipient: entrollment.student,
                course,
                message
            }))
        return this.notificationRepository.save(notification)
    }

    async getNotificationForUser(studentId: string) {
        const user = await this.userRepository.findOne({ where: { id: studentId } })
        if (!user) {
            throw new NotFoundException(`student with ${studentId} not found`)
        }
        return this.notificationRepository.find({
            where: { recipient: { id: user.id } },
            order: { createdAt: 'DESC' },
            relations: ['course']
        })
    }
}
