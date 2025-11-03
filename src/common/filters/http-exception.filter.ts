import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // HttpException response can be string or object
      if (typeof res === 'string') {
        message = res;
      } else if (res && typeof res === 'object') {
        // common Nest shape: { statusCode, message, error }
        // allow passing through a message and optional data
        // message can be string or array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body: any = res;
        if (body.message) {
          message = Array.isArray(body.message) ? body.message.join(', ') : String(body.message);
        } else if (body.error) {
          message = String(body.error);
        }
        if (body.data !== undefined) {
          data = body.data;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // log server errors with stack
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Unhandled exception on ${request.method} ${request.url}: ${String(message)}`, (exception as any)?.stack);
    } else {
      this.logger.warn(`HTTP ${status} on ${request.method} ${request.url}: ${String(message)}`);
    }

    const payload: { success: boolean; message: string; data?: any } = {
      success: false,
      message,
    };
    if (data !== undefined) payload.data = data;

    response.status(status).json(payload);
  }
}

export default HttpExceptionFilter;
