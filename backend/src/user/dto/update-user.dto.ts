import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';
import { Role } from 'src/shared/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role provided' }) // Use Role instead of UserRole
  role?: Role;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}
    