export interface IMongoConnection {
  name?: string;
  username: string;
  password: string;
  port: number;
  host: string;
  uri: string;
}

export interface IApiTechConnection {
  url: string;
  username: string;
  password: string;
}

export interface IGofileConnection {
  url: string;
  storeUrl: string;
  token?: string;
  folderId?: string;
}
