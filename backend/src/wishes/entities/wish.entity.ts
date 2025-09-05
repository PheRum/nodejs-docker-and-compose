import { BaseAbstractEntity } from '../../BaseAbstractEntity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';

// Схема для подарков
@Entity()
export class Wish extends BaseAbstractEntity {
  @Column({
    type: 'varchar',
    length: 250,
  })
  @Length(1, 250)
  name: string; // название подарка

  @Column()
  @IsUrl()
  @IsOptional()
  image?: string; // ссылка на изображение подарка

  @Column()
  @IsUrl()
  link: string; // ссылка на интернет-магазин, в котором можно приобрести подарок

  @Column('decimal', { precision: 16, scale: 2 })
  price: number; // стоимость подарка

  @Column('decimal', { precision: 16, scale: 2 })
  raised: number; // сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @Length(1, 1024)
  @IsOptional()
  description?: string; // строка с описанием подарка

  @OneToMany(() => Offer, (offer) => offer.item)
  @JoinColumn()
  offers: Offer[]; // массив ссылок на заявки скинуться от других пользователей

  @Column({
    type: 'numeric',
    precision: 1,
  })
  copied: number; // счётчик тех, кто скопировал подарок себе
}
