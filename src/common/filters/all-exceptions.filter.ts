import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    // Récupération du message
    let message = 'Internal server error'; // Message par défaut
    if (exception instanceof HttpException) {
      const responseMessage = exception.getResponse();
      // Si responseMessage est un objet, on extrait uniquement le message
      if (typeof responseMessage === 'object' && 'message' in responseMessage) {
        message = (responseMessage as any).message;
      } else {
        message = responseMessage as string;
      }
    }

    this.logger.error(`Exception: ${message} - URL: ${request.url}`);

    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
