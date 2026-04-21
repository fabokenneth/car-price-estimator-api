import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email = 'test2@ken.cm';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '123456',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toBe(email);
      });
  });

  it('signup as a new user , and get the currently logged in user', async () => {
    const email = 'test2@ken.cm';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '123456',
      })
      .expect(201);

    const cookie = res.headers['set-cookie'];

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });

  afterEach(async () => {
    await app.close();
  });
});
