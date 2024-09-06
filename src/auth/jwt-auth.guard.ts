import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('Invalid authorization header format');
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const token = authHeader.split(' ')[1];
      const user = this.jwtService.verify(token);
      request.user = user; // Attach the user to the request object
      return super.canActivate(context);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Log a warning if the token has expired
        this.logger.warn('Token expired for user');
      } else {
        // Log an error for other issues
        this.logger.error(`Token verification failed: ${error.message}`);
      }
      throw new UnauthorizedException('Could not authenticate token');
    }
  }
}
