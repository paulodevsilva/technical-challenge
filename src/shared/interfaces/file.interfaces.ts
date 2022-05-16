import { Document } from 'mongoose';

export interface IFile {
  name: string;
  fileId: string;
  folderId: string;
}

export interface IFileModel extends Document {
  name: string;
  fileId: string;
  folderId: string;
}
