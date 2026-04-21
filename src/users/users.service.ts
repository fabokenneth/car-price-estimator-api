import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const user = this.usersRepository.create({
      email,
      password,
    });

    return this.usersRepository.save(user);
  }

  findOne(id: number) {
    if (!id) {
      throw new NotFoundException('no user found with id ' + id);
    }
    return this.usersRepository.findOneBy({ id });
  }

  find(email: string) {
    return this.usersRepository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const userToUpdate = await this.findOne(id);

    if (!userToUpdate) {
      throw new NotFoundException('User NOT FOUND');
    }

    Object.assign(userToUpdate, attrs);
    return this.usersRepository.save(userToUpdate);
  }

  async remove(id: number) {
    const userToDelete = await this.findOne(id);

    if (!userToDelete) {
      throw new NotFoundException('User NOT FOUND');
    }

    return this.usersRepository.remove(userToDelete);
  }

  async signin(email: string, password: string) {
    const foundUserId = await this.usersRepository.findOneBy({
      email,
      password,
    });
    if (!foundUserId) {
      throw new UnauthorizedException('Email or Password invalid');
    }

    return foundUserId;
  }
}
