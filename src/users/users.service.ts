import { Repository } from 'typeorm';

import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CustomLoggerService } from '../custom-logger/custom-logger.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly loggerService: CustomLoggerService,
  ) {}

  create(dto: CreateUserDto) {
    this.loggerService.log('create...');
    const user = this.mapper.map(dto, CreateUserDto, User);
    return this.repository.save(user);
  }

  findAll() {
    this.loggerService.log('findAll...');
    return this.repository.find();
  }

  async findOne(id: string) {
    this.loggerService.log('findOne...');

    const user = await this.repository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    this.loggerService.log('update...');

    const user = await this.findOne(id);
    const newUser = structuredClone(user);
    Object.assign(newUser, dto);
    if (JSON.stringify(user) === JSON.stringify(newUser))
      throw new NotAcceptableException('No changes detected');

    return this.repository.save(newUser);
  }

  async remove(id: string) {
    this.loggerService.log('delete...');

    const user = await this.findOne(id);

    return this.repository.remove(user);
  }
}
