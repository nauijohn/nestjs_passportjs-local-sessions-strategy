import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { AutoMap } from '@automapper/classes';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  password: string;
}
