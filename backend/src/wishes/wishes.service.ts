import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private dataSource: DataSource,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto) {
    const wish = this.wishesRepository.create({
      raised: 0,
      copied: 0,
      owner: User.removePassword(owner),
      ...createWishDto,
    });

    return this.wishesRepository.save(wish);
  }

  findLast() {
    return this.wishesRepository.find({
      skip: 0,
      take: 40,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findTop() {
    return this.wishesRepository.find({
      skip: 0,
      take: 20,
      order: {
        copied: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish) delete wish.owner.password;

    const offers = wish.offers?.filter((offer) => !offer.hidden) || [];

    return { ...wish, offers, offersCount: wish.offers?.length };
  }

  updateRaise(id: number, raise: number) {
    return this.wishesRepository.save({ id, raised: raise });
  }

  async update(id: number, updateWishDto: UpdateWishDto, editorId: number) {
    const wish = await this.findOne(id);

    if (wish.owner.id !== editorId) {
      throw new ServerException(ErrorCode.WishCanEditOwn);
    }

    if (wish.offersCount) {
      throw new ServerException(ErrorCode.WishCanNotEditWithOffers);
    }

    await this.wishesRepository.save({ id, ...updateWishDto });

    return { ...wish, ...updateWishDto };
  }

  async remove(id: number, editorId: number) {
    const wish = await this.findOne(id);

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (wish.owner.id !== editorId) {
      throw new ServerException(ErrorCode.WishCanNotDelete);
    }
    await this.wishesRepository.delete({
      id,
    });

    return wish;
  }

  async copy(id: number, owner: User) {
    const originalWish = await this.findOne(id);

    let mywish: Wish | null = null;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.wishesRepository.increment({ id }, 'copied', 1);

      const { name, image, description, link, price } = originalWish;

      mywish = await this.create(owner, {
        name,
        image,
        description,
        link,
        price,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return mywish;
  }
}
