import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    loginDto: LoginDto,
  ): Promise<{ token: string; role: string }> {
    const { identifier, password } = loginDto;

    // Rechercher l'utilisateur par username ou email
    const user = await this.usersService.findByUsernameOrEmail(identifier);
    if (user && (await user.validatePassword(password))) {
      const payload = { username: user.username, sub: user.id };
      const token = this.jwtService.sign(payload);
      return { token, role: user.role };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
