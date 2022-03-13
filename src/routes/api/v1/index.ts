// ===========================
// SECTION | IMPORTS
// ===========================
import { Application } from 'express';
import { Client } from 'discord.js';
import root from '@routes/v1/root';
import users from '@routes/v1/users';
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
export default (app: Application, djsClient: Client) => {
  // -> Root
  app.use('/api/v1', root);

  // -> Users
  app.use('/api/v1/users', users(djsClient));
};
// =========================== !SECTION
