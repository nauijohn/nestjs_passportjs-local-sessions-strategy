import { Injectable, Logger } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportSerializer } from '@nestjs/passport';

import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  private readonly logger = new Logger('SessionSerializer');

  constructor(private readonly moduleRef: ModuleRef) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void): any {
    this.logger.log('START SessionSerializer serializeUser...');
    this.logger.debug(`user :${JSON.stringify(user)}`);
    this.logger.log('END SessionSerializer serializeUser...');
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error | null, payload: any) => void,
  ) {
    this.logger.log('START SessionSerializer deserializeUser...');
    this.logger.debug('payload: ', payload);

    const usersService = await this.moduleRef.resolve(
      UsersService,
      ContextIdFactory.create(),
      { strict: false },
    );

    const user = await usersService.findOne(payload.id);

    this.logger.debug(`user: ${JSON.stringify(user)}`);
    this.logger.log('END SessionSerializer deserializeUser...');
    done(null, user);
  }
}
