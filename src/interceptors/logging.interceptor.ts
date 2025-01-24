import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.loggerService.log(`intercept...`);
    const now = Date.now();
    this.loggerService.log(`Before... 0ms`);
    return next
      .handle()
      .pipe(
        tap(() => this.loggerService.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
