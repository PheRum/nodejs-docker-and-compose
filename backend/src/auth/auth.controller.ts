import {
  Body,
  Controller,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { ServerExceptionFilter } from '../filter/server-exception.filter';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('auth')
@UseFilters(ServerExceptionFilter)
@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiOkResponse({
    description: 'Пользователь успешно создан.',
    schema: { $ref: getSchemaPath(User) },
  })
  @Post('signup')
  public async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return this.authService.auth(user);
  }

  @ApiBody({
    schema: {
      example: {
        username: 'lykovrs',
        password: 'strong_password1Aa',
      },
    },
  })
  @ApiOkResponse({
    description: 'Успешная авторизация.',

    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE5LCJpYXQiOjE3MTgyNjkxNzl9.1PUnd9Slj88FU9H5A1ewrK7OF0WnD9XtOzHSH19VYCE',
      },
    },
  })
  @UseGuards(LocalGuard)
  @Post('signin')
  public signin(@Req() req) {
    return this.authService.auth(req.user);
  }
}
