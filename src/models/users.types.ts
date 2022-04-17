// Dependencies
import { Document, Model } from 'mongoose';

// Interface
export interface IUser {
  /** Discord ID of user */
  discordID: string;
  /** Public Key of user */
  publicKey?: string;
}

// Exports
export interface IUserDocument extends IUser, Document {
  addPublicKey(
    this: IUserDocument,
    publicKey: string,
  ): Promise<IUserDocument>;
}

export interface IUserModel extends Model<IUserDocument> {
  createUser(this: IUserModel, discordID: string): Promise<IUserDocument>;
}
