import dotenv from 'dotenv';
import fs from 'fs';
import {
  IApiTechConnection,
  IGofileConnection,
  IMongoConnection,
} from './interface/connection.interface';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    if (process.env.NODE_ENV == 'development') {
      this.envConfig = dotenv.config({
        path: `${process.env.NODE_ENV}.env`,
      });
    }

    this.envConfig = dotenv.config({
      path: `.env`,
    });
  }

  getApiTech(): IApiTechConnection {
    return {
      url: `${process.env.API_TECH_URL}`,
      username: `${process.env.API_TECH_USERNAME}`,
      password: `${process.env.API_TECH_PASSWORD}`,
    };
  }

  getGoFile(): IGofileConnection {
    return {
      url: `${process.env.API_GO_FILE_URL}`,
      storeUrl: `${process.env.API_GO_FILE_URL_STORE}`,
      token: `${process.env.GO_FILE_TOKEN}`,
      folderId: `${process.env.GO_FILE_FOLDER_ID}` || '',
    };
  }

  getMongo(): IMongoConnection {
    return {
      name: `${process.env.MONGO_NAME}`,
      username: `${process.env.MONGO_USERNAME}`,
      password: `${process.env.MONGO_PASSWORD}`,
      port: Number(`${process.env.MONGO_PORT}`),
      host: `${process.env.MONGO_HOST}`,
      uri: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`,
    };
  }
}
