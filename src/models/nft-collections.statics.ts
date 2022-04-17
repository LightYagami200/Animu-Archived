// Dependencies
import { INFTCollectionModel } from './nft-collections.types';

// Statics
export async function createNFTCollection(
  this: INFTCollectionModel,
  owner: string,
  name: string,
  description: string,
  logo: string,
  banner: string,
) {
  return await this.create({
    owner,
    name,
    description,
    logo,
    banner,
  });
}
