import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(
        createUserDto.password,
        this.configService.get<string>('jwt.saltOrRounds'),
      );

      const user = await this.usersRepository.create({
        ...createUserDto,
        password: hash,
      });

      await this.usersRepository.save(user);

      return User.removePassword(user);
    } catch (e) {
      if (e.code === '23505')
        throw new ServerException(ErrorCode.UserAlreadyExists);

      throw new ServerException(ErrorCode.SomethingWrong);
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return user;
  }

  async findOneWithWishes(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        wishes: true,
      },
    });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return user;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        const hash = await bcrypt.hash(
          updateUserDto.password,
          this.configService.get<string>('jwt.saltOrRounds'),
        );

        updateUserDto.password = hash;
      }

      const result = await this.usersRepository.save({
        id: user.id,
        ...updateUserDto,
      });

      return User.removePassword({ ...user, ...result });
    } catch (e) {
      if (e.code === '23505')
        throw new ServerException(ErrorCode.UserAlreadyExists);

      throw new ServerException(ErrorCode.SomethingWrong);
    }
  }

  async findByUsername(username: string, withPassword = false) {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return !withPassword ? User.removePassword(user) : user;
  }

  async findWishesByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
      },
    });

    if (!user) {
      throw new ServerException(ErrorCode.UserNotFound);
    }

    return user;
  }

  async findMany(query: string) {
    const users = await this.usersRepository.find({
      where: [
        {
          email: Like(`%${query}%`),
        },
        {
          username: Like(`%${query}%`),
        },
      ],
      order: {
        username: 'ASC',
        email: 'ASC',
      },
    });

    return users.map((user) => User.removePassword(user));
  }
}
