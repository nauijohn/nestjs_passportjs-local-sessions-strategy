import { Strategy } from 'passport-local';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

interface UserRequestPayload {
  id: string;
  email: string;
}

@Injectable()
export class LocalStrategy
  extends PassportStrategy(Strategy)
  implements OnModuleInit
{
  private readonly logger = new Logger('LocalStrategy');
  private authService: AuthService;
  private loggerService: CustomLoggerService;

  constructor(
    private readonly moduleRef: ModuleRef,
    // private readonly loggerService: CustomLoggerService,
  ) {
    super({
      usernameField: 'email',
      session: true,
    });
  }

  async onModuleInit() {
    this.authService = await this.moduleRef.resolve(
      AuthService,
      ContextIdFactory.create(),
    );
  }

  async validate(email: string, password: string) {
    this.logger.log('START validate...');

    const user = await this.authService.validateUser({ email, password });
    this.logger.debug(`user: ${JSON.stringify(user)}`);
    if (!user) {
      const error = new UnauthorizedException();
      this.logger.error(error);
      throw error;
    }

    const userPayload: UserRequestPayload = {
      id: user.id,
      email: user.email,
    };

    this.logger.log('END validate...');
    return userPayload;
  }
}
