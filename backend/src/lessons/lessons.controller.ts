import { Controller, Post, Body, UseInterceptors, UploadedFile, BadRequestException, Get, Res, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson,LessonType } from './lesson.entity';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Multer } from 'multer';
import * as fs from 'fs';
import { Response } from 'express';
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}
  //add lesson
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

  private readonly uploadPath = join(process.cwd(), 'uploads', 'pdf');
  

//get all leessson
@Get('course/:courseId')
async getLessonsByCourse(@Param('courseId') courseId: string) {
  try {
    const lessons = await this.lessonsService.getLessonsByCourse(courseId);
    if (!lessons || lessons.length === 0) {
      throw new NotFoundException('No lessons found for this course.');
    }
    return { success: true, lessons };
  } catch (error) {
    throw new InternalServerErrorException(error.message);
  }
}




  //download file
  @Get('download/:filename')
  async downloadLesson(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(this.uploadPath, filename);
    
    // Check if directory exists first
    if (!fs.existsSync(this.uploadPath)) {
      console.log(`Upload directory does not exist: ${this.uploadPath}`);
      throw new NotFoundException(`Upload directory not found. Please ensure the directory exists.`);
    }
    
    // Then check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      throw new NotFoundException(`File ${filename} not found.`);
    }
    
    // Send file as response
    return res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        throw new InternalServerErrorException('Error downloading file');
      }
    });
  }
  
}
