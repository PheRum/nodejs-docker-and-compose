// users.controller.spec.ts
import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const currentUser: User = {
    id: 1,
    email: 'lykovrs@gmail.com',
    password: 'superstrong',
  } as User;

  const item: CreateUserDto = {
    about: 'about test',
    avatar: 'https://i.pravatar.cc/300',
    email: 'test@test.ru',
    password: 'mrslykova@gmail.com',
    username: 'mrslykova',
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue({
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        findByUsername: jest.fn(),
        findOneWithWishes: jest.fn(),
        findWishesByUsername: jest.fn(),
        findMany: jest.fn(),
      })
      .compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('.updateMe() should call update method of the service', () => {
    usersController.updateMe({ user: currentUser }, item);

    expect(usersService.update).toHaveBeenCalledWith(currentUser, item);
  });

  it('.getMyWishes() should call findOneWithWishes method of the service', () => {
    usersController.getMyWishes({ user: currentUser });

    expect(usersService.findOneWithWishes).toHaveBeenCalledWith(currentUser.id);
  });

  it('.findOneByName() should call findOneWithWishes method of the service', () => {
    usersController.findOneByName(currentUser.username);

    expect(usersService.findByUsername).toHaveBeenCalledWith(
      currentUser.username,
    );
  });

  it('.findWishesByName() should call findOneWithWishes method of the service', () => {
    usersController.findWishesByName(currentUser.username);

    expect(usersService.findWishesByUsername).toHaveBeenCalledWith(
      currentUser.username,
    );
  });

  it('.find() should call findMany method of the service', () => {
    const query = 'test';
    usersController.find({ query });

    expect(usersService.findMany).toHaveBeenCalledWith(query);
  });
});
