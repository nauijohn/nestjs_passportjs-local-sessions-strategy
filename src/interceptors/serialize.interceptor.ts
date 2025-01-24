import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';

interface ClassContructor {
  new (...args: any[]): {};
}

class SerializeInterceptor implements NestInterceptor {
  private loggerService: CustomLoggerService;

  constructor(private readonly dto: ClassContructor) {
    this.loggerService = new CustomLoggerService();
    this.loggerService.parentClassName = '[SerializeInterceptor]';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest() as Request;
    this.loggerService.requestId = `[${request.headers['requestId']}]`;
    this.loggerService.url = `[${request.method} ${request.url.replace('/api/v1', '')}]`;

    return next.handle().pipe(
      map((data: ClassContructor) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
