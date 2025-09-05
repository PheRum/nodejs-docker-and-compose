import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  FIND_USER_QUERY_MAX_LENGTH,
  FIND_USER_QUERY_MIN_LENGTH,
} from '../users.constants';

export class FindUserDto {
  @ApiProperty({
    description: 'адрес электронной почты или имя пользователя',
    minimum: FIND_USER_QUERY_MIN_LENGTH,
    maximum: FIND_USER_QUERY_MAX_LENGTH,
  })
  @Length(FIND_USER_QUERY_MIN_LENGTH, FIND_USER_QUERY_MAX_LENGTH)
  public query: string;
}
