// Dependencies
import { IUserDocument } from './users.types';

// Statics
export async function addPublicKey(
  this: IUserDocument,
  publicKey: string,
) {
  return await this.updateOne({ publicKey });
}
