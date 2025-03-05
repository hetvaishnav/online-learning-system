import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/shared/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByRole(role:any): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { fullName, email, password, role, profilePicture } = updateUserDto;

    // Check if email is being updated and already exists
    if (email && email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('Email is already in use');
      }
      user.email = email;
    }

    // Hash password if updating
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (fullName) {
      user.fullName = fullName;
    }

    if (profilePicture) {
      user.profilePicture = profilePicture;
    }

    // Validate and update role
    if (role) {
      if (!Object.values(Role).includes(role as Role)) {
        throw new BadRequestException(`Invalid role: ${role}`);
      }
      user.role = role as Role;
    }

    await this.userRepository.save(user);
    return user;
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} is not found`);
    }

    await this.userRepository.remove(user);
    return true;
  }
}
