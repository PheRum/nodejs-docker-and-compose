import { ApiProperty, PickType } from '@nestjs/swagger';

import { User } from '../entities/user.entity';
import { IsStrongPassword } from 'class-validator';

export class CreateUserDto extends PickType(User, [
  'email',
  'password',
  'username',
  'avatar',
  'about',
] as const) {
  @ApiProperty({
    description: 'пароль пользователя',
    example: 'strong_password1Aa',
  })
  @IsStrongPassword()
  public password: string;
}
