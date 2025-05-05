import { Controller, Get, UseGuards, Req, InternalServerErrorException, Param, NotFoundException, Put, Body, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { RolesGuard } from 'src/shared/guard/roles.guard';
import { Roles } from 'src/shared/guard/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
//@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile') 
  @UseGuards(AuthGuard('jwt'))  
  getProfile(@Req() req) {
    return req.user;  
  }


  //@Roles(Role.ADMIN)
  @Get()
  async getAllUsers() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @Get('role/:role')
@Roles(Role.ADMIN) // Only Admin can access
async getUsersByRole(@Param('role') role: Role) {
  try {
    const users = await this.userService.findByRole(role);
    if (!users.length) {
      throw new NotFoundException(`No users found with role: ${role}`);
    }
    return users;
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch users');
  }
}
@Roles(Role.ADMIN) 
@Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.userService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }

}
