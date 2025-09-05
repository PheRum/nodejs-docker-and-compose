import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  auth(user: User) {
    const secretOrKey = this.configService.get<string>('jwt.secret');
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: secretOrKey }),
    };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username, true);

    if (!user) return null;

    const matched = await bcrypt.compare(password, user.password);

    if (matched) {
      /* Исключаем пароль из результата */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
