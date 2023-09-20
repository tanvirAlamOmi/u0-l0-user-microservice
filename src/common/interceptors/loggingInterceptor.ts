import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLogger } from '../logs/index';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const body = JSON.stringify(req.body);
    const now = Date.now();

    return next.handle().pipe(
      tap(response => {
        const logString = `
          ${method} ${url}
          REQUEST: ${body}
          RESPONSE: ${JSON.stringify(response)}
          TIME: ${Date.now() - now}ms
        `;
        WinstonLogger.info(logString);
      }),
    );
  }
}
