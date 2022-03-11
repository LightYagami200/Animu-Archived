// ===========================
// SECTION | IMPORTS
// ===========================
import { Application } from 'express';
import { Client } from 'discord.js';
import root from '@routes/v1/root';
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
export default (app: Application, djsClient: Client) => {
  // -> Root
  app.use('/api/v1', root);
};
// =========================== !SECTION
