import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson,LessonType } from './lesson.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Multer } from 'multer';
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/pdfs',  // Save PDFs locally
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Only PDF files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() file?: Multer.File,
  ): Promise<Lesson> {
    return this.lessonsService.addLesson(createLessonDto, file);
  }
}
