// ===========================
// SECTION | IMPORTS
// ===========================
import { Application } from 'express';
import { Client } from 'discord.js';
import root from '@routes/v1/root';
import users from '@routes/v1/users';
import collections from './collections';
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
export default (app: Application, _djsClient: Client) => {
  // -> Root
  app.use('/api/v1', root);

  // -> Users
  app.use('/api/v1/users', users);

  // -> Collections
  app.use('/api/v1/collections', collections);
};
// =========================== !SECTION
