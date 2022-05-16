import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import { connect } from 'mongoose';
import { ConfigService } from './config/config.service';
import { GoFileController } from './api/controllers/gofile.controller';
import cors from 'cors';
import multer from 'multer';

import UserConversionJob from './jobs/user/user-conversion.job';
import UploadFileJob from './jobs/user/upload-file.job';
import { cronJob } from './util/cron.util';
import { logger } from './util/logger.util';
// import { loadJobs } from './util/load-jobs.util';

const userConversionJob = new UserConversionJob();
const uploadFileJob = new UploadFileJob();
export class SetupServer extends Server {
  private server?: http.Server;

  constructor(
    private port = process.env.API_PORT || 3333,
    protected credentialsMongo = new ConfigService().getMongo()
  ) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupMongo();
    this.setupControllers();
    this.setupCron();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(cors({ origin: '*' }));
    this.app.use(multer().single('file'));
  }

  private setupControllers(): void {
    const goFileController = new GoFileController();
    this.addControllers([goFileController]);
  }

  private setupCron(): void {
    cronJob('0 * * * *', () => {
      Promise.all([userConversionJob.execute(), uploadFileJob.execute()]);
    });
  }

  public getApp(): Application {
    return this.app;
  }

  public async setupMongo(): Promise<void> {
    await connect(this.credentialsMongo.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info(`Server listening on port: ${this.port}`);
    });
  }
}
