import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

export class RegisterDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional() 
  role?: Role; 
}
