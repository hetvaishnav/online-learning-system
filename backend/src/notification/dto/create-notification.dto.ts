import { IsUUID, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  courseId: string; 

  @IsString()
  message: string;
} 
