import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsUUID()
  @IsOptional()
  chatRoomId?: string;

  @IsNotEmpty()
  @IsUUID()
  senderId: string;
}
