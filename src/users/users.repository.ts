import { readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { DbData } from './db-types/types';

@Injectable()
export class UsersRepository {
  async signin(email: string, password: string) {
    const contents = await readFile('data.json', 'utf8');
    const dbData = JSON.parse(contents) as DbData;

    const matchingUserData = dbData.users.find(
      (user) => user.email === email && user.password === password,
    );

    if (matchingUserData) {
      matchingUserData.isSignedIn = true;
      await writeFile('data.json', JSON.stringify(dbData));
      return matchingUserData?.id;
    }
    return '';
  }

  async userAlreadyExist(email: string) {
    const contents = await readFile('data.json', 'utf8');
    const dbData = JSON.parse(contents) as DbData;

    return !!dbData.users.find((user) => user.email === email);
  }

  async signup(email: string, password: string) {
    const contents = await readFile('data.json', 'utf8');
    const dbData = JSON.parse(contents) as DbData;

    const users = dbData.users;

    const id = Math.random().toString(36).substr(2, 9);

    users.push({
      id,
      email,
      password,
      isSignedIn: true,
    });
    dbData.users = users;
    await writeFile('data.json', JSON.stringify(dbData));
  }
}
