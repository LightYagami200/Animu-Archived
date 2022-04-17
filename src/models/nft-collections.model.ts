// Dependencies
import { model } from 'mongoose';
import {
  INFTCollectionDocument,
  INFTCollectionModel,
} from '@models/nft-collections.types';
import NFTCollectionSchema from '@models/nft-collections.schema';

// Export
export const NFTCollectionModel = model<
  INFTCollectionDocument,
  INFTCollectionModel
>('NFTCollection', NFTCollectionSchema);
