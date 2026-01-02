import { Process, Processor, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';
import { EnrollmentsService } from 'src/enrollments/enrollments.service';

@Processor('lesson-notifications')
export class LessonsProcessor {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    @OnQueueActive()
    onActive(job: Job) {
        console.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
    }

    @Process('notify-students')
    async handleNotification(job: Job) {
        const { courseId, lessonTitle } = job.data;

        console.log(`Start notifiying students for new lesson: "${lessonTitle}" in course ${courseId}`);

        try {
            const students = await this.enrollmentsService.getEnrolledStudents(courseId);

            if (students.length === 0) {
                console.log('No students enrolled to notify.');
                return;
            }

            console.log(`Found ${students.length} students to notify.`);

            for (const student of students) {
                console.log(`[EMAIL SIMULATION] Sending email to: ${student.email}`);
                console.log(`Subject: New Lesson Added: ${lessonTitle}`);
                console.log(`Body: Hi ${student.fullName}, a new lesson "${lessonTitle}" is now available in your course.`);
                console.log('---------------------------------------------------');
            }

            console.log('All notifications sent successfully.');
        } catch (error) {
            console.error('Failed to notify students:', error);
            throw error;
        }
    }
}
