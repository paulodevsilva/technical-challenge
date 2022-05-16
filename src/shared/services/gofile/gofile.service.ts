import { ConfigService } from '../../../config/config.service';
import { ErrorUtil } from '../../../util/error.util';
import * as HTTPUtil from '../../../util/request.util';
import { xmlToJson } from '../../../util/xml-to-json.util';
import FormData from 'form-data';
import { model } from 'mongoose';
import url from 'url';

import { IFile } from '../../interfaces/file.interfaces';
import { FileSchema } from '../../schemas/file.schemas';
import { IFolder } from '../../interfaces/folder.interfaces';

const form = new FormData();

export class GoFileService {
  private fileModel = model<IFile>('Files', FileSchema);
  private folderModel = model<IFolder>('Files', FileSchema);

  constructor(
    protected credentials = new ConfigService().getGoFile(),
    protected request = new HTTPUtil.Request()
  ) {
    this.credentials = credentials;
    this.parentFolderId = '';
  }

  private async getInfo(): Promise<any> {
    try {
      const response = await this.request.get(
        `${this.credentials.url}/getAccountDetails?token=${this.credentials.token}`
      );

      return response.data.data.rootFolder;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new ErrorUtil(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`,
          'Go File'
        );
      }

      throw new ErrorUtil(err.message, 'Go File');
    }
  }

  async upload(file: any, folderId?: string): Promise<any> {
    try {
      const folderIdParams = this.credentials.folderId
        ? this.credentials.folderId
        : folderId;
      form.append(file.originalname, file.buffer, {
        filename: file.originalname,
      });
      form.append('token', this.credentials.token);
      form.append('folderId', folderIdParams);

      const response = await this.request.post(
        `${this.credentials.storeUrl}/uploadFile`,
        form,
        {
          headers: form.getHeaders(),
        }
      );

      const filePayload = await this.fileModel({
        name: response.data.data.fileName,
        fileId: response.data.data.fileId,
        folderId: response.data.data.parentFolder,
      }).save();

      return {
        dowloadPage: response.data.data.downloadPage,
        status: response.data.status,
      };
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new ErrorUtil(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`,
          'Go File'
        );
      }

      throw new ErrorUtil(err.message, 'Go File');
    }
  }

  async createFolder(folderName: string): Promise<any> {
    try {
      this.parentFolderId = await this.getInfo();

      const params = new url.URLSearchParams({
        parentFolderId: this.parentFolderId,
        token: this.credentials.token,
        folderName,
      });

      const response = await this.request.put(
        `${this.credentials.url}/createFolder`,
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const folder = await this.folderModel({
        name: response.data.data.name,
        id: response.data.data.id,
      }).save();

      console.log(response.data);

      return { status: response.data.status, data: response.data.data };
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new ErrorUtil(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`,
          'Go File'
        );
      }

      throw new ErrorUtil(err.message, 'Go File');
    }
  }

  async deleteFile(fileId: string): Promise<any> {
    try {
      const params = new url.URLSearchParams({
        contentsId: fileId,
        token: this.credentials.token,
      });

      const response = await this.request.delete(
        `${this.credentials.url}/deleteContent`,

        {
          data: params.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data.status == 'error-notFound') {
        return { message: 'File not found, make file' };
      }

      return response.data;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new ErrorUtil(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`,
          'Go File'
        );
      }

      throw new ErrorUtil(err.message, 'Go File');
    }
  }
}
