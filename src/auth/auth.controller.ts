import { Controller, Post } from '@nestjs/common';

import { CustomLoggerService } from '../custom-logger/custom-logger.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loggerService: CustomLoggerService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  signUp() {
    this.loggerService.log('signUp...');
  }
}
