import execParallel from '../../util/parallel.util';
import { UserService } from '../services/api-tech/user.service';

import { model } from 'mongoose';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { UserSchema } from '../../shared/schemas/user.schemas';
import { logger } from '../../util/logger.util';

export default class UserConversionJob {
  private readonly userService: UserService;
  private userModel = model<IUser>('User', UserSchema);
  constructor() {
    this.userService = new UserService();
  }

  public async execute(): Promise<void> {
    logger.info('UserConversionJob Started');
    let limit = 2;
    let page = 1;
    let limitStop = false;
    const users = [];
    do {
      const usersReponse = await this.userService.getUsers(limit, page);
      users.push(...usersReponse.users);

      ++limit;
      ++page;
      limitStop = usersReponse.limit;
    } while (limitStop);

    logger.info('Users', { users });

    execParallel(users, async (user) => {
      const address = await this.userService.getAddress(user.id);

      const userPayload: IUser = {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        address: address.street,
        addressNumber: address.number['$t'],
        phoneNumber: address.phoneNumber || '',
      };

      logger.info('User Payload', { userPayload });

      const userSave = new this.userModel(userPayload);
      const saved = await userSave.save();

      logger.info('User Saved', { saved });
    });

    logger.info('UserConversionJob closed');
  }
}
