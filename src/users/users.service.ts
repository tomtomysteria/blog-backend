import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

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
      role: role as UserRole,
      createdBy: user?.username,
    });
    const result = await this.userRepository.save(newUser);
    this.logger.verbose(
      `User ${result.username} created successfully by ${user.username}`,
    );
    return result;
  }

  async findAll(): Promise<User[]> {
    const results = await this.userRepository.find();
    this.logger.verbose(`Found ${results.length} users`);
    return results;
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

    // Si le mot de passe n'est pas fourni, on garde l'ancien mot de passe
    if (!updateUserDto.password) {
      delete updateUserDto.password; // Supprimer le champ si vide pour ne pas le modifier
    }

    Object.assign(existingUser, updateUserDto);
    existingUser.updatedBy = user.username;
    const updatedUser = await this.userRepository.save(existingUser);
    this.logger.verbose(`User with ID: ${id} updated successfully`);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
    this.logger.verbose(`User with ID: ${id} deleted successfully`);
  }
}
