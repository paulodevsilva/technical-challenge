import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  addressNumber: { type: String },
  phoneNumber: { type: String },
});
