import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from './reports.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report-dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}
  async createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = estimateDto;
    return this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  create(reportDTO: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(reportDTO);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  async changeApprove(reportId: string, approved: boolean) {
    const report = await this.reportsRepository.findOne({
      where: { id: parseInt(reportId) },
    });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    report.approved = approved;

    return this.reportsRepository.save(report);
  }
}
