import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private dataSource: DataSource,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto, wish: Wish) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let offer: Offer | null = null;

    try {
      const otherOffers = await this.offerRepository.find({
        where: {
          item: { id: createOfferDto.itemId },
        },
      });

      const sum = otherOffers.reduce((total, offer) => {
        return total + +offer.amount;
      }, 0);

      const raised = sum + createOfferDto.amount;

      await this.wishesService.updateRaise(wish.id, raised);

      offer = await this.offerRepository.create({
        ...createOfferDto,
        user,
        item: { id: createOfferDto.itemId },
      });

      await this.offerRepository.save(offer);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return {
      ...offer,
      user: User.removePassword(offer.user),
    };
  }

  async findAll() {
    const offers = await this.offerRepository.find({
      relations: { user: true, item: true },
    });

    offers.forEach((offer) => delete offer.user.password);

    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: { user: true, item: true },
    });

    return {
      ...offer,
      user: User.removePassword(offer.user),
    };
  }

  update(id: number, updateOfferDto: UpdateOfferDto) {
    return this.offerRepository.save({ id, ...updateOfferDto });
  }

  remove(id: number) {
    return this.offerRepository.delete({
      id,
    });
  }
}
