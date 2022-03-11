// ===========================
// SECTION | IMPORTS
// ===========================
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import apiV1 from '@routes/v1/index';
import { Client } from 'discord.js';
// =========================== !SECTION

// ===========================
// SECTION | INIT
// ===========================
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
export default (client: Client) => {
  // Root
  app.get('/', (_req, res) =>
    res.json({
      status: 'online',

      versions: {
        1: {
          baseUrl: '/api/v1',
        },
      },
    }),
  );

  // -> API v1
  apiV1(app, client);

  app.listen(process.env.PORT || 4000, () =>
    console.log('API Status: Online'),
  );
};
// =========================== !SECTION
