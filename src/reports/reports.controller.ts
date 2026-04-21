import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report-dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/report-feedback-dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
@Serialize(ReportDto)
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get()
  getCarEstimation(@Query() query: GetEstimateDto) {
    return this.reportService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() report: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(report, user);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  approve(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportService.changeApprove(id, body.approved);
  }
}
