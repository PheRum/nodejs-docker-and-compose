import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseAbstractEntity {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: '1',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'дата создания, тип значения Date',
    example: new Date(),
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'дата изменения, тип значения Date',
    example: new Date(),
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
