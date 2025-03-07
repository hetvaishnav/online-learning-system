import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { LessonType } from '../lesson.entity';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  lessonOrder: number;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsNotEmpty()
  @IsEnum(LessonType)
  contentType: LessonType;

  @IsOptional()
  @IsString()
  contentUrl?: string;  // Required for Video/Text
}
