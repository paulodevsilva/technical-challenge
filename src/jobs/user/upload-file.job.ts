import execParallel from '../../util/parallel.util';

import { model } from 'mongoose';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { UserSchema } from '../../shared/schemas/user.schemas';
import { jsonToCsv } from '../../util/json-to-csv.util';
import { GoFileService } from '../../shared/services/gofile/gofile.service';
import { logger } from '../../util/logger.util';

export default class UploadFileJob {
  private readonly goFileService: GoFileService;
  private userModel = model<IUser>('User', UserSchema);
  constructor() {
    this.goFileService = new GoFileService();
  }

  public async execute(): Promise<void> {
    logger.info('UploadFileJob Started');
    const users = await this.userModel.find();

    logger.info('Users', { users });
    execParallel(users, async (user) => {
      const csv = jsonToCsv(user, [
        'fullName',
        'email',
        'address',
        'addressNumber',
        'phoneNumber',
      ]);

      const payload = {
        buffer: csv,
        originalname: `${user.fullName}.csv`,
      };
      await this.goFileService.upload(payload);
    });

    logger.info('UploadFileJob closed');
  }
}
