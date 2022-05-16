import { ConfigService } from '../../../config/config.service';
import { IUser } from '@src/shared/interfaces/user.interfaces';
import { ErrorUtil } from '../../../util/error.util';
import * as HTTPUtil from '../../../util/request.util';
import { xmlToJson } from '../../../util/xml-to-json.util';

export class UserService {
  page: number;
  limit: number;

  constructor(
    protected credentials = new ConfigService().getApiTech(),
    protected request = new HTTPUtil.Request()
  ) {
    this.credentials = credentials;
  }

  static paginate(page: number, limit: number): void {
    this.page = ++page;
    this.limit = ++limit;
  }

  async getUsers(limit, page): Promise<IUser[]> {
    try {
      const response = await this.request.get(
        `${this.credentials.url}/users?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.credentials.username}:${this.credentials.password}`
            ).toString('base64')}`,
          },
        }
      );

      const json = xmlToJson(`${response.data}`);

      if (json.data.usersList.item.length > 1) {
        return { users: json.data.usersList.item, limit: false };
      }

      if (json.data.usersList.item) {
        return { limit: true };
      }

      return { users: [json.data.usersList.item], limit: false };
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new ErrorUtil(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`,
          'User'
        );
      }

      throw new ErrorUtil(err.message, 'User');
    }
  }

  async getAddress(userId: string): Promise<any> {
    try {
      const response = await this.request.get(
        `${this.credentials.url}/users/${userId}/address`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.credentials.username}:${this.credentials.password}`
            ).toString('base64')}`,
          },
        }
      );
      const json = xmlToJson(`${response.data}`);

      const [address] = json.data.item;

      return address;
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new ErrorUtil(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`,
          'User'
        );
      }

      throw new ErrorUtil(err.message, 'User');
    }
  }
}
