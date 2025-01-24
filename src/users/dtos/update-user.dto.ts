import { IsEmail, IsOptional, IsString } from 'class-validator';

import { AutoMap } from '@automapper/classes';

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @AutoMap()
  email: string;

  @IsString()
  @IsOptional()
  @AutoMap()
  password: string;
}
