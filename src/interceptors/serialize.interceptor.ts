import { map, Observable } from 'rxjs';

import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('I am running before the handler', context);

    return next.handle().pipe(
      map((data: unknown) => {
        console.log('I am running before sending the response', data);
        return data;
      }),
    );
  }
}
