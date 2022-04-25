// Dependencies
import slugify from 'slugify';
import { INFTCollectionModel } from './nft-collections.types';

// Statics
export async function createNFTCollection(
  this: INFTCollectionModel,
  owner: string,
  name: string,
  description: string,
) {
  const slug = slugify(name, { lower: true });

  // -> Is slug taken?
  const isSlugTaken = await this.findOne({ slug });

  return await this.create({
    owner,
    name,
    description,
    slug: isSlugTaken ? `${slug}-${Date.now()}` : slug,
  });
}
