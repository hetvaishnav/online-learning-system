import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/couese.dto';
 

@Injectable()
export class CoursesService {
    constructor(@InjectRepository(Course)

    private readonly courseRepository:Repository<Course>,

){}
async createCourse(dto:CreateCourseDto):Promise<Course>{
if(dto.startDate>=dto.endDate){
    throw new BadRequestException('start date must be before end date')
}

const course=this.courseRepository.create(dto)
return await this.courseRepository.save(course)
}




}
