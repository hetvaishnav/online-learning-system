import { Controller, Post, Body, UseGuards, HttpException, HttpStatus, Get, Put, Param, Delete, Query, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/couese.dto';
import { Roles } from 'src/shared/guard/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateVideoDto } from './dto/upload.vedio.dto';
import { Express } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
@Controller('courses')
//@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @Roles(Role.TEACHER)
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.createCourse(createCourseDto);
  }
  @Roles(Role.ADMIN)
  @Get('allcourses')
  async getAllCourses(
    @Query('limit') limit: number=10,
    @Query('offset') offset: number=0
  ) {
    try {
      const courses = await this.coursesService.getAllCourses(+limit, +offset);
      if (!courses.length) {
        throw new HttpException('No courses found', HttpStatus.NOT_FOUND);
      }
      return courses;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('teacher/:teacherId')
  async getCoursesByTeacher(@Param('teacherId') teacherId: string) {
    try {
      return await this.coursesService.getCoursesByTeacher(teacherId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get(':courseId')
  async getCoursesById(@Param('courseId') courseId: string) {
    try {
      return await this.coursesService.getCoursesById(courseId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      return await this.coursesService.updateCourse(id, updateCourseDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: string) {
    try {
      return await this.coursesService.deleteCourse(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  async searchCourse(@Query('title') title: string): Promise<Course[]> {
    return this.coursesService.searchCourse(title)
  }

  // course.controller.ts
  @Post('upload-video')
  @UseInterceptors(FileInterceptor('file', {
    dest: './uploads/videos', // local folder
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload video to a course',
    schema: {
      type: 'object',
      properties: {
        courseId: {
          type: 'string',
          format: 'uuid',
        },
        title: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['courseId', 'title', 'file'],
    },
  })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateVideoDto,
  ) {
    const videoUrl = `uploads/videos/${file.filename}`;
    return this.coursesService.addVideoToCourse(body.courseId, body.title, videoUrl);
  }

  @Get('stream/:filename')
  streamVideo(@Param('filename') filename: string, @Res() res: Response, @Req() req: Request) {
    const videoPath = join(__dirname, '..', '..', 'uploads', 'videos', filename);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  }

  @Get('course-video/:courseId')
  getCoursevideobyId(@Param('courseId') courseId: string) {
    try {
      return this.coursesService.getCoursevideobyId(courseId)
    } catch (error) {
      console.log(error);
    }
  }

  @Get('course-video/:id')
  getCoursevideobyvId(@Param('id') id: string) {
    try {
      return this.coursesService.getCoursevideobyvId(id)
    } catch (error) {
      console.log(error);
    }
  }

}
