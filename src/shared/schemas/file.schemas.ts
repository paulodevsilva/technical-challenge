import { Schema } from 'mongoose';

export const FileSchema = new Schema({
  name: { type: String },
  fileId: { type: String, unique: true },
  folderId: { type: String },
});
