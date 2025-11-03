import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type WrappedResponse = {
  success: boolean;
  message: string;
  data?: unknown;
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        // If the handler already returned a wrapped response, don't double-wrap
        if (
          data &&
          typeof data === 'object' &&
          'success' in (data as Record<string, unknown>) &&
          'message' in (data as Record<string, unknown>)
        ) {
          return data;
        }

        return {
          success: true,
          message: 'Success',
          data: data === undefined ? null : data,
        } as WrappedResponse;
      }),
    );
  }
}
