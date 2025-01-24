import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    request.headers.requestId = uuidv4();
    response.setHeader('RequestId', request.headers.requestId);
    next();
  }
}
