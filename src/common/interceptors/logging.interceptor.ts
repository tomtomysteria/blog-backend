import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    this.logger.log(`Incoming Request - Method: ${method} URL: ${url}`); // Log avant l'exécution

    const now = Date.now();
    return next.handle().pipe(
      tap(
        () =>
          this.logger.log(
            `Outgoing Response - Method: ${method} URL: ${url} - Time: ${Date.now() - now}ms`,
          ), // Log après l'exécution
      ),
    );
  }
}
