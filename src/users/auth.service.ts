import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'node:util';
import { randomBytes, scrypt as _scrypt } from 'node:crypto';

const script = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    const existingUserWithSameEmail = await this.usersService.find(email);

    // TODO
    /*
       Avoid this approach to check database, as it scanss the whole table.
       use UNIQUE indexes as explained here in questions section
       https://www.udemy.com/course/nestjs-the-complete-developers-guide/learn/lecture/27442248#questions/18289852
    */

    if (existingUserWithSameEmail.length) {
      throw new BadRequestException('User already exists');
    }

    // hash user password here

    // Generate a salt

    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together

    const hash = (await script(password, salt,32)) as Buffer;

    // Jpin the hash and the salt together

    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it

    // return the user

    return this.usersService.create(email, result);
  }
  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Hash the salt and the password together

    const [salt, storedHash] = user.password.split('.');

    const hash = (await script(password, salt, 32)) as Buffer;

    // compare with user instance password

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong email or password');
    }

    return user;
  }
}
