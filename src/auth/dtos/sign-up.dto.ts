import { IsEmail, IsString } from 'class-validator';

import { AutoMap } from '@automapper/classes';

export class SignUpDto {
  @IsString()
  @IsEmail()
  @AutoMap()
  email: string;

  @IsString()
  @AutoMap()
  password: string;
}
