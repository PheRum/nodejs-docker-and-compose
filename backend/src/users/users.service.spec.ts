import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

export class UsersRepositoryFake {
  items: User[] = [];
  public create(item): void {
    this.items.push(item);
  }
  public async save(): Promise<void> {
    debugger;
  }
  public async remove(): Promise<void> {
    debugger;
  }
  public async find(): Promise<User[]> {
    return this.items;
  }
}

describe('UsersService', () => {
  let usersService: UsersService;
  let configService: ConfigService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: ConfigService,
          useValue: { get: () => 10 },
        },
        {
          provide: getRepositoryToken(User),
          useClass: UsersRepositoryFake,
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
    configService = module.get(ConfigService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  describe('.findAll', () => {
    const users: CreateUserDto[] = [
      {
        username: 'User_1',
        avatar: 'https://i.pravatar.cc/300',
        email: 'test1@test.ru',
        password: 'strong_password1Aa',
        about: 'about User_1',
      },
      {
        username: 'User_2',
        avatar: 'https://i.pravatar.cc/300',
        email: 'test2@test.ru',
        password: 'strong_password1Aa',
        about: 'about User_2',
      },
      {
        username: 'User_3',
        avatar: 'https://i.pravatar.cc/300',
        email: 'test3@test.ru',
        password: 'strong_password1Aa',
        about: 'about User_3',
      },
      {
        username: 'User_4',
        avatar: 'https://i.pravatar.cc/300',
        email: 'test4@test.ru',
        password: 'strong_password1Aa',
        about: 'about User_4',
      },
    ];

    beforeEach(() => {
      users.forEach((user) => usersService.create(user));
    });

    it('should return all users if called without options', async () => {
      const items = await usersService.findAll();
      expect(items.length).toEqual(users.length);

      items.forEach((item, i) => {
        expect(item).toMatchObject({
          username: users[i].username,
          avatar: users[i].avatar,
          email: users[i].email,
          // password: users[i].password,
          about: users[i].about,
        });
      });
    });
    //
    //   it('should return correct posts for skip and limit options', () => {
    //     const skip = 1;
    //     const items = usersService.findMany({ skip, limit: 2 });
    //
    //     expect(items.length).toEqual(2);
    //
    //     items.forEach((item, i) => {
    //       expect(item).toMatchObject({
    //         text: posts[i + skip].text,
    //       });
    //     });
    //   });
    //
    //   it('should return correct posts for only skip option', () => {
    //     const skip = 1;
    //     const items = usersService.findMany({ skip });
    //
    //     expect(items.length).toEqual(posts.length - skip);
    //
    //     items.forEach((item, i) => {
    //       expect(item).toMatchObject({
    //         text: posts[i + skip].text,
    //       });
    //     });
    //   });
    //
    //   it('should return correct posts for only limit option', () => {
    //     const limit = 2;
    //     const items = usersService.findMany({ limit });
    //
    //     expect(items.length).toEqual(limit);
    //
    //     items.forEach((item, i) => {
    //       expect(item).toMatchObject({
    //         text: posts[i].text,
    //       });
    //     });
    //   });
  });
});
