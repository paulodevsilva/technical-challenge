import { Document } from 'mongoose';

export interface IFolder {
  id: string;
  name: string;
}

export interface IFolderModel extends Document {
  id: string;
  name: string;
}
