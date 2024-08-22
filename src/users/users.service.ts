import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Remplacez cette implémentation par celle qui correspond à votre logique de base de données
  async findByCredentials(loginDto: LoginDto): Promise<User | null> {
    const { username, password } = loginDto;

    // Ici vous devriez implémenter la logique pour vérifier l'utilisateur dans la base de données
    const user = await this.findUserByUsername(username);

    // Supposons que vous avez une méthode pour vérifier le mot de passe
    if (user && user.password === password) {
      // Utiliser un hash de mot de passe sécurisé en production
      return user;
    }

    return null;
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    // Utilisation de username pour trouver l'utilisateur
    return this.userRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
