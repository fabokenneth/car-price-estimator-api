import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './src/config/database.config';

export default new DataSource({
  ...getDatabaseConfig(['src/**/*.entity.ts']),
  migrations: ['migrations/*.ts'],
});
