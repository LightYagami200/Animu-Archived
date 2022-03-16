// Dependencies
import { Schema } from 'mongoose';
import { IUserDocument, IUserModel } from '@models/users.types';
import { createUser } from './users.statics';
import { addPublicKey } from './users.methods';

// Schema
const UserSchema = new Schema<IUserDocument, IUserModel>({
  discordID: {
    type: String,
    unique: true,
  },
  publicKey: {
    type: String,
    index: true,
  },
});

// Statics
UserSchema.statics.createUser = createUser;

// Methods
UserSchema.methods.addPublicKey = addPublicKey;

// Exports
export default UserSchema;
