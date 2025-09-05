import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ServerExceptionFilter } from '../filter/server-exception.filter';
import { JwtGuard } from '../guards/auth.guard';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Wish } from '../wishes/entities/wish.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseFilters(ServerExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOkResponse({
    description: 'Пользователь',
    type: User,
  })
  @UseGuards(JwtGuard)
  @Get('/me')
  me(@Req() req) {
    return User.removePassword(req.user);
  }

  @ApiOkResponse({
    description: 'Пользователь',
    type: User,
  })
  @UseGuards(JwtGuard)
  @Patch('/me')
  updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user, updateUserDto);
  }

  @ApiOkResponse({
    description: 'Мои подарки',
    type: Wish,
    isArray: true,
  })
  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  async getMyWishes(@Req() req) {
    const me = await this.usersService.findOneWithWishes(req.user.id);

    return me?.wishes || [];
  }

  @ApiOkResponse({
    description: 'Пользователь',
    type: User,
  })
  @UseGuards(JwtGuard)
  @Get(':name')
  findOneByName(@Param('name') name: string) {
    return this.usersService.findByUsername(name);
  }

  @ApiOkResponse({
    description: 'Подарки пользователя',
    type: Wish,
    isArray: true,
  })
  @UseGuards(JwtGuard)
  @Get(':name/wishes')
  async findWishesByName(@Param('name') name: string) {
    const user = await this.usersService.findWishesByUsername(name);

    return user?.wishes || [];
  }

  @ApiOkResponse({
    description: 'Пользователь',
    type: User,
  })
  @UseGuards(JwtGuard)
  @Post('/find')
  find(@Body() findUserDto: FindUserDto) {
    return this.usersService.findMany(findUserDto.query);
  }
}
