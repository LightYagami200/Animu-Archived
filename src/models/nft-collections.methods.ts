// Dependencies
import { INFTCollectionDocument } from './nft-collections.types';

// Statics

// -> Update collection
export async function updateNFTCollection(
  this: INFTCollectionDocument,
  update: {
    name?: string;
    description?: string;
    socials?: {
      websiteURI?: string;
      twitterUsername?: string;
      discordInviteCode?: string;
      instagramUsername?: string;
    };
    logo?: string;
    banner?: string;
    tags?: string[];
  },
) {
  return await this.updateOne(update);
}
