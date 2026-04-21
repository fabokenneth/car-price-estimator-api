import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { DbData, DbDataReport } from '../users/db-types/types';

@Injectable()
export class ReportsRepository {
  async getCarPriceEstimation(
    make: string,
    model: string,
    year: string,
    mileage: string,
    longitude: number,
    latitude: number,
  ) {
    const contents = await readFile('data.json', 'utf8');
    const dbData = JSON.parse(contents) as DbData;

    const reportsData = dbData.reports;

    return reportsData.filter(
      (item) =>
        item.make === make &&
        item.year === year &&
        item.latitude === latitude &&
        item.longitude === longitude &&
        item.mileage === mileage &&
        item.model === model,
    );
  }

  async addNewPriceEstimation(
    make: string,
    model: string,
    year: string,
    mileage: string,
    longitude: number,
    latitude: number,
    price: number,
  ) {
    const contents = await readFile('data.json', 'utf8');
    const dbData = JSON.parse(contents) as DbData;

    const reports = dbData.reports;

    const id = Math.random().toString(36).substr(2, 9);

    reports.push({
      id,
      make,
      model,
      year,
      mileage,
      longitude,
      latitude,
      price,
      approved: false,
    });
    await writeFile('data.json', JSON.stringify(dbData));
  }

  async findReport(id: string) {
    const contents = await readFile('data.json', 'utf8');
    const dbData = JSON.parse(contents) as DbData;

    return dbData.reports.find((item) => item.id === id);
  }

  async appreciateReport(reportData: DbDataReport, approved: boolean) {
    const contents = await readFile('data.json', 'utf8');
    const dbData = JSON.parse(contents) as DbData;

    const foundReport = dbData.reports.find(
      (item) => item.id === reportData.id,
    );

    if (foundReport) {
      foundReport.approved = approved;
    }
  }
}
