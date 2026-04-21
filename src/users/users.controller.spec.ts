import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'kenmail@test.cm',
          password: 'toto',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 123,
            email,
          },
        ] as User[]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email, password) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findAllUsers returns a list of users with a given email', async () => {
    const users = await controller.findAllUsers('toto@gmail.cm');
    expect(users.length).toEqual(1);
    expect(users.at(0)?.email).toEqual('toto@gmail.cm');
  });
  it('findUser returns a user with a given id', async () => {
    const user = await controller.findUser('123');
    expect(user).toBeDefined();
    expect(user.id).toEqual(123);
  });

  it('findUser throws and error if a user with a given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('123')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns a user', async () => {
    const session = { userId: -10 };

    const user = await controller.signIn(
      {
        email: 'hello@mail.cm',
        password: 'mypassword',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
