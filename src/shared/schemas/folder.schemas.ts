import { Schema } from 'mongoose';

export const FolderSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
});
