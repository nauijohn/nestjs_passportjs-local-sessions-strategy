import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly loggerService: CustomLoggerService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    this.loggerService.log('create...');

    this.loggerService.debug('dto: ', dto);

    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    this.loggerService.log('findAll...');
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.loggerService.log('findOne...');
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    this.loggerService.log('update...');
    this.loggerService.debug('dto: ', dto);
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.loggerService.log('remove...');
    return this.usersService.remove(id);
  }
}
