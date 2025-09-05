import { BaseAbstractEntity } from '../../BaseAbstractEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

// Схема желающих скинуться
@Entity()
export class Offer extends BaseAbstractEntity {
  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn()
  user: User; // содержит желающего скинуться

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinColumn()
  item: Wish; // содержит ссылку на товар

  @Column('decimal', { precision: 16, scale: 2 })
  amount: number; // сумма заявки

  @Column({
    type: 'boolean',
    default: false,
  })
  hidden: boolean; // флаг, который определяет показывать ли информацию о скидывающемся в списке
}
