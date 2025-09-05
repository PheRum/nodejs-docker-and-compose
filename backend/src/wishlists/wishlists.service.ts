import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  create(owner: User, createWishlistDto: CreateWishlistDto) {
    const wish = this.wishlistRepository.create({
      owner: User.removePassword(owner),
      ...createWishlistDto,
      items: createWishlistDto.itemsId.map((id) => ({ id })),
    });

    return this.wishlistRepository.save(wish);
  }

  async findAll() {
    const wishlists = await this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });

    wishlists.forEach((wishlist) => delete wishlist.owner.password);

    return wishlists;
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new ServerException(ErrorCode.WishlistNotFound);
    }

    if (wishlist) delete wishlist.owner.password;

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    editorId: number,
  ) {
    const wishlist = await this.findOne(+id);

    if (wishlist.owner.id !== editorId) {
      throw new ServerException(ErrorCode.WishlistCanNotEdit);
    }

    await this.wishlistRepository.save({ id, ...updateWishlistDto });

    return { ...wishlist, ...updateWishlistDto };
  }

  async remove(id: number, editorId: number) {
    const wishlist = await this.findOne(+id);
    if (wishlist.owner.id !== editorId) {
      throw new ServerException(ErrorCode.WishlistCanNotDelete);
    }
    return this.wishlistRepository.delete({
      id,
    });
  }
}
