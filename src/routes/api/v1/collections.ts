// ===========================
// SECTION | IMPORTS
// ===========================
import { Request, Response, Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { validateUser } from '@routes/middlewares';
import { NFTCollectionModel } from '@models/nft-collections.model';
import AWS from 'aws-sdk';
import { awsAccessKeyId, awsSecretAccessKey } from '@keys';
import { isValidObjectId } from 'mongoose';
// =========================== !SECTION

// ===========================
// SECTION | INIT
// ===========================
AWS.config.update({
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

const collections = Router();
const s3 = new AWS.S3();
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
  '/:id',
  validateUser(true),
  [param('id').isMongoId()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // -> Get body properties
    const { name, description, socials, tags } = req.body;

    // -> Find collection
    const collection = await NFTCollectionModel.findOne({
      _id: req.params.id,
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

    // -> Update collection
    await collection.updateNFTCollection({
      name,
      description,
      socials,
      tags,
    });

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
      ? await NFTCollectionModel.findById(idOrSlug)
      : await NFTCollectionModel.findOne({
          slug: idOrSlug,
        });

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

    res.json(collection);
  },
);

export default collections;
// =========================== !SECTION
