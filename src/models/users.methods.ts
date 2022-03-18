// Dependencies
import { UserModel } from './users.model';
import { IUserDocument } from './users.types';

// Statics
export async function addPublicKey(
  this: IUserDocument,
  publicKey: string,
) {
  return await UserModel.findOneAndUpdate({ publicKey });
}
