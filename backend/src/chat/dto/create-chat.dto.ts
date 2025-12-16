import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsNotEmpty()
  @IsUUID()
  senderId: string;
}
