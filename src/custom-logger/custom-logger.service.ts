import { Request } from 'express';

import {
  ConsoleLogger,
  Inject,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INQUIRER, REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService
  extends ConsoleLogger
  implements LoggerService
{
  public parentClassName = `[${this.parentClass?.constructor?.name}]`;
  private LOG_ENV = true;
  private NODE_ENV = 'test';
  public requestId = this.request
    ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `[${this.request.headers.requestId}]`
    : '';
  public url = (this.request
    ? `[${this.request.method} ${this.request.originalUrl}]`
    : ''
  ).replace('/api/v1', '');

  constructor(
    private readonly configService?: ConfigService,
    @Inject(REQUEST) private readonly request?: Request,
    @Inject(INQUIRER) private readonly parentClass?: object,
  ) {
    super();
    if (this.configService?.get<string>('LOG_ENV')?.toLowerCase() === 'prd')
      this.LOG_ENV = false;
    if (this.configService?.get<string>('NODE_ENV')?.toLowerCase() !== 'test')
      this.NODE_ENV = '';
  }

  /**
   * General logging
   * @param message
   * @param data
   */
  log(message: any, data?: any) {
    if (this.LOG_ENV && this.NODE_ENV !== 'test') {
      if (typeof data === 'object') data = JSON.stringify(data, null, 0);
      if (typeof data === 'boolean') data = String(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const context = data ? `${message}${data}` : message;
      super.log(
        `${this.colorize(this.requestId, 'verbose')}${this.colorize(this.url, 'debug')}${this.colorize(
          this.parentClassName,
          'warn',
        )} ${this.colorize(context, 'log')}`,
      );
    }
  }

  method(methodName: string) {
    this.log(`Method: ${methodName}...`);
  }

  /**
   * Logging for messages
   * @param message
   * @param data
   */
  verbose(message: any, data?: any) {
    if (this.LOG_ENV && this.NODE_ENV !== 'test') {
      if (typeof data === 'object') data = JSON.stringify(data, null, 0);
      if (typeof data === 'boolean') data = String(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const context = data ? `${message}${data}` : message;
      super.verbose(
        `${this.colorize(this.requestId, 'verbose')}${this.colorize(this.url, 'debug')}${this.colorize(
          this.parentClassName,
          'warn',
        )} ${this.colorize(context, 'verbose')}`,
      );
    }
  }

  debug(message: any, data?: any) {
    if (this.LOG_ENV && this.NODE_ENV !== 'test') {
      if (typeof data === 'object') data = JSON.stringify(data, null, 0);
      if (typeof data === 'boolean') data = String(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const context = data ? `${message}${data}` : message;
      super.debug(
        `${this.colorize(this.requestId, 'verbose')}${this.colorize(this.url, 'debug')}${this.colorize(
          this.parentClassName,
          'warn',
        )} ${this.colorize(context, 'debug')}`,
      );
    }
  }

  warn(message: any, data?: any) {
    if (this.LOG_ENV && this.NODE_ENV !== 'test') {
      if (typeof data === 'object') data = JSON.stringify(data, null, 0);
      if (typeof data === 'boolean') data = String(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const context = data ? `${message}${data}` : message;
      super.warn(
        `${this.colorize(this.requestId, 'verbose')}${this.colorize(this.url, 'debug')}${this.colorize(
          this.parentClassName,
          'warn',
        )} ${this.colorize(context, 'warn')}`,
      );
    }
  }

  error(message: any, data?: any) {
    if (this.NODE_ENV !== 'test') {
      if (typeof data === 'object')
        if (!(data instanceof Error)) data = JSON.stringify(data, null, 0);
      if (typeof data === 'boolean') data = String(data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const context = data ? `${message}${data}` : message;

      super.error(
        `${this.colorize(this.requestId, 'verbose')}${this.colorize(this.url, 'debug')}${this.colorize(
          this.parentClassName,
          'warn',
        )} ${this.colorize(context, 'error')}`,
      );
    }
  }
}
