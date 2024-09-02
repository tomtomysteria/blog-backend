import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
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
    const { firstname, lastname, birthdate, email, username, password, role } =
      createUserDto;

    const newUser = this.userRepository.create({
      firstname,
      lastname,
      birthdate: birthdate ? new Date(birthdate) : undefined,
      email,
      username,
      password,
      role: role as UserRole, // Assurez-vous que le rôle est bien typé
      createdBy: user.username, // Assurez-vous que 'createdBy' est bien une propriété dans l'entité
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
    existingUser.updatedBy = user.username; // Assurez-vous que 'updatedBy' est bien une propriété dans l'entité
    return this.userRepository.save(existingUser);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
