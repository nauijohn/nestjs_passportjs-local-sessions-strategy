import { IsEmail, IsString } from 'class-validator';

import { AutoMap } from '@automapper/classes';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsString()
  @AutoMap()
  password: string;
}
