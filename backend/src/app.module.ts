import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { Course } from './courses/course.entity';
import { LessonsModule } from './lessons/lessons.module';
import { Lesson } from './lessons/lesson.entity';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PaymentModule } from './payment/payment.module';
import { Enrollment } from './enrollments/enrollment.entity';
import { Payment } from './payment/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "Oneclick1@",
        database: "learning",
        entities: [User,Course,Lesson,Enrollment,Payment],
        synchronize: true,
      }),
  }),
    UserModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    EnrollmentsModule,
    PaymentModule
  ],
})
export class AppModule {}
