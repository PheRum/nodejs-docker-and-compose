import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../guards/auth.guard';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';
import { WishesService } from '../wishes/wishes.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('offers')
@ApiBearerAuth()
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (!wish) {
      throw new ServerException(ErrorCode.WishNotFound);
    }

    if (req.user.id === wish.owner.id) {
      throw new ServerException(ErrorCode.OfferCanNotOwnEdit);
    }

    if (createOfferDto.amount + wish.raised > wish.price) {
      throw new ServerException(ErrorCode.OfferAmount);
    }

    return this.offersService.create(req.user, createOfferDto, wish);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const offer = await this.offersService.findOne(+id);

    if (!offer) {
      throw new ServerException(ErrorCode.OfferNotFound);
    }
    return offer;
  }
}
