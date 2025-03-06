import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/couese.dto';
import { User } from 'src/user/user.entity';
 

@Injectable()
export class CoursesService {
    constructor(@InjectRepository(Course)
    private readonly courseRepository:Repository<Course>,
    @InjectRepository(User)
    private readonly userRepository:Repository<User>
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




}
