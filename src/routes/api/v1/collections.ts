// ===========================
// SECTION | IMPORTS
// ===========================
import { Request, Response, Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { validateUser } from '@routes/middlewares';
import { NFTCollectionModel } from '@models/nft-collections.model';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsAccessKeyId, awsSecretAccessKey, s3BucketName } from '@keys';
import { isValidObjectId } from 'mongoose';
// =========================== !SECTION

// ===========================
// SECTION | INIT
// ===========================
const collections = Router();
const s3Client = new S3Client({
  region: 'eu-central-1',
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
// -> Get All Collections with pagination
collections.get(
  '/',
  [query('page').isNumeric(), query('limit').isNumeric()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // -> Get query params
    const { page, limit } = req.query;

    // -> Apply constraints
    const pageQ = parseInt(page as string);
    const limitQ = Math.min(parseInt(limit as string), 20);
    const offset = (Math.max(pageQ, 1) - 1) * limitQ;

    const collections = await NFTCollectionModel.find(
      {
        status: 'published',
      },
      {},
      {
        sort: {
          createdAt: -1,
        },
        skip: offset,
        limit: limitQ,
      },
    );

    res.json(collections);
  },
);

// -> Create a new collection
collections.post(
  '/',
  validateUser(true),
  [
    body('name').isString().notEmpty(),
    body('description').isString().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // -> Get body properties
    const { name, description } = req.body;

    // -> Create new collection
    const collection = await NFTCollectionModel.createNFTCollection(
      req.user.discord.id,
      name,
      description,
    );

    res.json(collection);
  },
);

// -> Get collections of logged in user
collections.get(
  '/me',
  [validateUser(true)],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // -> Get collections
    const collections = await NFTCollectionModel.find({
      owner: req.user.discord.id,
    });

    res.json(collections);
  },
);

// -> Update a collection
collections.put(
  '/:idOrSlug',
  validateUser(true),
  [param('idOrSlug').isString().not().isEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // -> Get body properties
    const { name, description, socials, tags, logo, banner } = req.body;

    // -> Get param
    const { idOrSlug } = req.params;

    // -> Find collection
    const collection = isValidObjectId(idOrSlug)
      ? await NFTCollectionModel.findOne({
          _id: idOrSlug,
          owner: req.user.discord.id,
        })
      : await NFTCollectionModel.findOne({
          slug: idOrSlug,
          owner: req.user.discord.id,
        });

    // -> Check if collection exists
    if (!collection)
      return res.status(404).json({
        errors: [
          {
            msg: 'Collection not found',
          },
        ],
      });

    // -> If logo/banner
    if (logo) {
      await collection.updateNFTCollection({
        logo: `https://${s3BucketName}.s3.eu-central-1.amazonaws.com/collection-logos/${collection._id}`,
      });
    } else if (banner) {
      await collection.updateNFTCollection({
        banner: `https://${s3BucketName}.s3.eu-central-1.amazonaws.com/collection-banners/${collection._id}`,
      });
    } else {
      // -> Update collection
      await collection.updateNFTCollection({
        name: name || collection.name,
        description: description || collection.description,
        socials: socials || collection.socials,
        tags: tags || collection.tags,
      });
    }

    res.json(collection);
  },
);

// -> Get Collection by ID or Slug
collections.get(
  '/:idOrSlug',
  [param('idOrSlug').isString().not().isEmpty(), validateUser(false)],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // -> Get params
    const { idOrSlug } = req.params;

    // -> Get collection
    const collection = isValidObjectId(idOrSlug)
      ? await NFTCollectionModel.findById(idOrSlug).lean()
      : await NFTCollectionModel.findOne({
          slug: idOrSlug,
        }).lean();

    console.log({ collection });

    if (
      !collection ||
      (collection.status !== 'published' &&
        (!req.user || req.user.discord.id !== collection.owner))
    )
      return res.status(404).json({
        errors: [
          {
            msg: 'Collection not found',
          },
        ],
      });

    let bannerSignedURL;
    let logoSignedURL;

    // -> If collection owner
    if (req.user && req.user.discord.id === collection.owner) {
      const bannerCommand = new PutObjectCommand({
        Bucket: s3BucketName,
        Key: `collection-banners/${collection._id}`,
      });
      const logoCommand = new PutObjectCommand({
        Bucket: s3BucketName,
        Key: `collection-logos/${collection._id}`,
      });

      bannerSignedURL = await getSignedUrl(s3Client, bannerCommand, {
        expiresIn: 3600,
      });
      logoSignedURL = await getSignedUrl(s3Client, logoCommand, {
        expiresIn: 3600,
      });
    }

    res.json({ ...collection, bannerSignedURL, logoSignedURL });
  },
);

export default collections;
// =========================== !SECTION
