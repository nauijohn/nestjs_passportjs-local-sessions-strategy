import { Request } from 'express';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { promisify } from 'util';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CustomLoggerService } from '../custom-logger/custom-logger.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { UserDto } from './dtos/user.dto';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loggerService: CustomLoggerService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  @Serialize(UserDto)
  async signUp(@Body() dto: SignUpDto) {
    this.loggerService.log('signUp...');

    const userInDb = await this.usersService.findOneByEmail(dto.email);
    if (userInDb) throw new BadRequestException('User already exists');

    const hashedPassword = await this.authService.hashPassword(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
    });
    if (!user) throw new InternalServerErrorException('User not created');

    return user;
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn() {
    this.loggerService.log('signIn...');

    return {
      message: 'User signed in successfully',
    };
  }

  @Post('sign-out')
  async signOut(@Req() req: Request) {
    this.loggerService.log('signOut...');

    // const logOut = promisify(req.logOut).bind(req);
    // const x = await logOut();
    // console.log('x: ', x);

    const destroy = promisify(req.session.destroy).bind(req.session);
    const x = await destroy();
    console.log('x: ', x);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  test() {
    console.log('AuthController test');
    return 'AuthController test';
  }
}
