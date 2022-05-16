import { Post, Delete, Get, Controller } from '@overnightjs/core';
import { GoFileService } from '../../shared/services/gofile/gofile.service';
import { Request, Response } from 'express';
import { ErrorUtil } from '../../util/error.util';

@Controller('gofile')
export class GoFileController {
  private goFileService: GoFileService;
  constructor() {
    this.goFileService = new GoFileService();
  }
  @Post('createFolder')
  public async createFolder(req: Request, res: Response): Promise<any> {
    try {
      const response = await this.goFileService.createFolder(
        req.body.folderName
      );

      res.status(200).send(response);
    } catch (err) {
      throw new ErrorUtil(err.message, 'Go File Controller');
    }
  }

  @Post('uploadFile/:folderId')
  public async uploadFile(req: Request, res: Response): Promise<any> {
    try {
      const reponse = await this.goFileService.upload(
        req.file,
        req.params.folderId
      );

      res.status(200).send(reponse);
    } catch (err) {
      res
        .status(404)
        .send({ message: 'Folder not found, make a folder first' });
      throw new ErrorUtil(err.message, 'Go File Controller');
    }
  }

  @Delete('deleteFile/:fileId')
  public async deleteFile(req: Request, res: Response): Promise<any> {
    try {
      const response = await this.goFileService.deleteFile(req.params.fileId);
      res.status(200).send(response);
    } catch (err) {
      throw new ErrorUtil(err.message, 'Go File Controller');
    }
  }
}
