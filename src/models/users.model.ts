// Dependencies
import { model } from 'mongoose';
import { IUserDocument, IUserModel } from '@models/users.types';
import UserSchema from '@models/users.schema';

// Export
export const UserModel = model<IUserDocument, IUserModel>(
  'User',
  UserSchema,
);
