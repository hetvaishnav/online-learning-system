// create-video.dto.ts
import { IsUUID, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsUUID()
  courseId: string;

  @IsString()
  title: string;
}
