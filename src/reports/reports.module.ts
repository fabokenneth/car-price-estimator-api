import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity } from 'typeorm';
import { User } from '../users/user.entity';
import { Report } from './report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
