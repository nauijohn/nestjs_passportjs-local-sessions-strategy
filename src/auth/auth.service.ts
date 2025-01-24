import * as bcrypt from 'bcrypt';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';
import { UsersService } from 'src/users/users.service';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { SignInDto } from './dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(dto: SignInDto) {
    this.loggerService.log('validateUser...');

    const user = await this.usersService.findOneByEmail(dto.email);
    console.log('user: ', user);
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    console.log('isPasswordValid: ', isPasswordValid);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async hashPassword(password: string) {
    this.loggerService.log('hashPassword...');

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }
}
