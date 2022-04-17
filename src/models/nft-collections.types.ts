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
  socials: INFTCollectionSocials;
  /** Collection Logo */
  logo: string;
  /** Collection Banner */
  banner: string;
  /** Collection Tags */
  tags: string[];
  /** Collection Status */
  status: 'draft' | 'published';
}

// Exports
export interface INFTCollectionDocument extends INFTCollection, Document {}

export interface INFTCollectionModel
  extends Model<INFTCollectionDocument> {
  createNFTCollection(
    this: INFTCollectionModel,
    owner: string,
    name: string,
    description: string,
    logo: string,
    banner: string,
  ): Promise<INFTCollectionDocument>;
}
