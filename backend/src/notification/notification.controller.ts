import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationsService: NotificationService) {}

    @Post('course-update')
    async sendCourseUpdateNotification(@Body() dto: CreateNotificationDto) {
      return this.notificationsService.sendCourseUpdateNotification(dto);
    }
    @Get('user/:studentId')
    async getNotificationForUser(@Param('studentId') studentId:string){
      return this.notificationsService.getNotificationForUser(studentId)
    }                               

}
