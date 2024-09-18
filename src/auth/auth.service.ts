import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
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
  ): Promise<{ accessToken: string; refreshToken: string; role: string }> {
    const { identifier, password } = loginDto;

    // Rechercher l'utilisateur par username ou email
    const user = await this.usersService.findByUsernameOrEmail(identifier);
    if (user && (await user.validatePassword(password))) {
      const { accessToken, refreshToken } = this.generateTokens(user.id);
      return { accessToken, refreshToken, role: user.role };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  generateTokens(userId: string) {
    const payload = { sub: userId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user.id);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      } else {
        throw new UnauthorizedException('Could not refresh token');
      }
    }
  }
}
