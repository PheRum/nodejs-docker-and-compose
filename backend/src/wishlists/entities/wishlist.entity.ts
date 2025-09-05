import { BaseAbstractEntity } from '../../BaseAbstractEntity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';

// Cхема списка подарков
@Entity()
export class Wishlist extends BaseAbstractEntity {
  @Column({
    type: 'varchar',
    length: 250,
  })
  @Length(1, 250)
  name: string; // название подарка

  @Column({
    nullable: true,
    type: 'varchar',
    length: 1500,
  })
  @Length(1, 1500)
  @IsOptional()
  description: string; // описание подборки

  @Column()
  @IsUrl()
  image: string; // обложка для подборки

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[]; // набор ссылок на подарки

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User; // создатель подборки
}
