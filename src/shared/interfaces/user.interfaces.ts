import { Document } from 'mongoose';

export interface IUser {
  fullName: string;
  email: string;
  address: string;
  addressNumber: string;
  phoneNumber: string;
}

export interface IUserModel extends Document {
  fullName: string;
  email: string;
  address: string;
  addressNumber: string;
  phoneNumber: string;
}
