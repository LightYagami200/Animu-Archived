// ===========================
// SECTION | IMPORTS
// ===========================
import { Request, Response, Router } from 'express';
import { param, query, validationResult } from 'express-validator';
import { validateUser } from '@routes/middlewares';
import { NFTCollectionModel } from '@models/nft-collections.model';
// =========================== !SECTION

// ===========================
// SECTION | INIT
// ===========================
const collections = Router();
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
export default () => {
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
      const offset = (pageQ - 1) * limitQ;

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

  // -> Get Collection by ID
  collections.get(
    '/:id',
    [param('id').isNumeric().not().isEmpty()],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      // -> Get params
      const { id } = req.params;

      // -> Get collection
      const collection = await NFTCollectionModel.findOne({
        _id: id,
        status: 'published',
      });

      if (!collection)
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

  // -> Get collections of logged in user
  collections.get(
    '/me',
    [validateUser],
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

  // -> Get a collection of logged in user by ID
  collections.get(
    '/me/:id',
    [validateUser, param('id').isNumeric().not().isEmpty()],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      // -> Get params
      const { id } = req.params;

      // -> Get collection
      const collection = await NFTCollectionModel.findOne({
        _id: id,
        owner: req.user.discord.id,
      });

      if (!collection)
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

  return collections;
};
// =========================== !SECTION
