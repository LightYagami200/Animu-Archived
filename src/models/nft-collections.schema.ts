// Dependencies
import { Schema } from 'mongoose';
import {
  INFTCollectionDocument,
  INFTCollectionModel,
} from '@models/nft-collections.types';
import { createNFTCollection } from './nft-collections.statics';

// Schema
const NFTCollectionSchema = new Schema<
  INFTCollectionDocument,
  INFTCollectionModel
>({
  owner: {
    type: String,
    required: true,
    index: true,
  },
  name: String,
  description: String,
  socials: {
    websiteURI: String,
    twitterUsername: String,
    discordInviteCode: String,
    instagramUsername: String,
  },
  logo: String,
  banner: String,
  tags: {
    type: [String],
    index: true,
    default: [],
  },
  status: {
    type: String,
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Statics
NFTCollectionSchema.statics.createNFTCollection = createNFTCollection;

// Methods

// Exports
export default NFTCollectionSchema;
