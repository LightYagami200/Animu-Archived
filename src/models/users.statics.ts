// Dependencies
import { IUserModel } from './users.types';

// Statics
export async function createUser(this: IUserModel, discordID: string) {
  return await this.create({ discordID });
}
