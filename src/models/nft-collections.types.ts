// Dependencies
import { Document, Model } from 'mongoose';

// Interfaces
export interface INFTCollectionSocials {
  websiteURI?: string;
  twitterUsername?: string;
  discordInviteCode?: string;
  instagramUsername?: string;
}

export interface INFTCollection {
  /** Discord ID of NFTCollection Owner */
  owner: string;
  /** Collection Name */
  name: string;
  /** Collection Description */
  description: string;
  /** Collection Socials */
  socials?: INFTCollectionSocials;
  /** Collection Logo */
  logo?: string;
  /** Collection Banner */
  banner?: string;
  /** Collection slug */
  slug: string;
  /** Collection Tags */
  tags?: string[];
  /** Collection Status */
  status: 'draft' | 'published';
  /** Creation Date */
  createdAt: Date;
}

// Exports
export interface INFTCollectionDocument extends INFTCollection, Document {
  updateNFTCollection(
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
      slug?: string[];
    },
  ): Promise<INFTCollectionDocument>;
}

export interface INFTCollectionModel
  extends Model<INFTCollectionDocument> {
  createNFTCollection(
    this: INFTCollectionModel,
    owner: string,
    name: string,
    description: string,
  ): Promise<INFTCollectionDocument>;
}
