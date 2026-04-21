import { DataSourceOptions } from 'typeorm';

export function getDatabaseConfig(
  entities: DataSourceOptions['entities'],
): DataSourceOptions {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        type: 'sqlite',
        database: 'db.sqlite',
        entities,
        synchronize: false,
      };
    case 'test':
      return {
        type: 'sqlite',
        database: 'test.sqlite',
        entities,
        migrations: ['migrations/*.ts'],
        migrationsRun: true,
        synchronize: false,
      };
    case 'production':
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        migrationsRun: true,
        entities,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    default:
      throw new Error(`Unsupported environment: ${process.env.NODE_ENV}`);
  }
}
