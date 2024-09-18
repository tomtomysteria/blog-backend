import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

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

    const token = authHeader.split(' ')[1];

    try {
      // Vérifier le token d'accès avec JwtService
      const user = this.jwtService.verify(token);
      request.user = user; // Assigner l'utilisateur à la requête
      return super.canActivate(context); // Autoriser la requête
    } catch (error) {
      // Gestion des erreurs spécifiques liées au token
      if (error instanceof TokenExpiredError) {
        this.logger.warn('Token expired for user');
        throw new UnauthorizedException('Token expired');
      } else {
        this.logger.error(`Token verification failed: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
