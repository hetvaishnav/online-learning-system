import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from 'src/shared/guard/roles.guard';
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  PassportModule.register({ defaultStrategy: 'jwt' }),  // ✅ Enable Passport
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',  // ✅ Store in .env
      signOptions: { expiresIn: '1h' },  // ✅ Token expires in 1 hour
    }),

],
  controllers: [AuthController,],
  providers: [AuthService,JwtStrategy,RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
