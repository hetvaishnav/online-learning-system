import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { ILike, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/couese.dto';
import { User } from 'src/user/user.entity';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseVideo } from './course.video.entity';
 

@Injectable()
export class CoursesService {
     
    constructor(@InjectRepository(Course)
    private readonly courseRepository:Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    @InjectRepository(CourseVideo)
    private readonly videoRepo:Repository<CourseVideo>
){}
async createCourse(dto:CreateCourseDto):Promise<Course>{
    const { title, description, category, thumbnail, teacherId, price, startDate, endDate } = dto;

    // ✅ Check if the teacher exists in the users table
    const teacher = await this.userRepository.findOne({ where: { id: teacherId } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    // ✅ Create the course
    const course = this.courseRepository.create({
      title,
      description,
      category,
      thumbnail,
      teacher, // Assign the teacher object
      price,
      startDate,
      endDate,
    });

    await this.courseRepository.save(course);
    return course;
}

async getAllCourses(): Promise<Course[]> {
    try {
      const courses = await this.courseRepository.find({ relations: ['teacher'] });

      if (!courses || courses.length === 0) {
        throw new NotFoundException('No courses found');
      }

      return courses;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching courses');
    }
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      Object.assign(course, updateCourseDto);
      await this.courseRepository.save(course);
      
      return course;
    } catch (error) {
      throw new InternalServerErrorException('Error updating course');
    }
  }
  async deleteCourse(id: string): Promise<{ message: string }> {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });
  
      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }
  
      await this.courseRepository.remove(course);
  
      return { message: `Course with ID ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting course');
    }
  }

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    try {
      // Check if teacher exists
      const teacher = await this.userRepository.findOne({ where: { id: teacherId } });

      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
      }

      // Get courses by teacher ID
      const courses = await this.courseRepository.find({
        where: { teacher: { id: teacherId } ,},
        relations:['teacher']
      });

      return courses;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching courses by teacher');
    }
  }
  async getCoursesById(courseId: string): Promise<Course> {
    try {
      // Check if teacher exists
      const course = await this.courseRepository.findOne({ where: { id: courseId } });

      if (!course) {
        throw new NotFoundException(`course with ID ${course} not found`);
      }

      // Get courses by teacher ID
      return course
    
    } catch (error) {
      throw new InternalServerErrorException('Error fetching courses by teacher');
    }
  }
  

  async searchCourse(title:string):Promise<Course[]>{
    return this.courseRepository.find({
      where:{title:ILike(`%${title}%`),isPublished:true},
      order:{createdAt:'DESC'}
    })
  }
  async addVideoToCourse(courseId: string, title: string, videoUrl: string) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
  
    const video = this.videoRepo.create({ course, title, videoUrl });
    return this.videoRepo.save(video);
  }
  
}


