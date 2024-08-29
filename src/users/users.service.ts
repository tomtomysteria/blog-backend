import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsernameOrEmail(identifier: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
  }

  async create(createUserDto: CreateUserDto, user: User): Promise<User> {
    const newUser = this.userRepository.create({
      ...createUserDto,
      createdBy: user.username,
    });
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    user: User,
  ): Promise<User> {
    const existingUser = await this.findOne(id);
    Object.assign(existingUser, updateUserDto);
    existingUser.updatedBy = user.username;
    return this.userRepository.save(existingUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
