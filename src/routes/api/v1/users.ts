// ===========================
// SECTION | IMPORTS
// ===========================
import axios from 'axios';
import { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import {
  discordClientID,
  discordClientSecret,
  discordRedirectURI,
  encryptionSecret,
} from '@keys';
import { Client } from 'discord.js';
import { validateUser } from '@routes/middlewares';
// =========================== !SECTION

// ===========================
// SECTION | INIT
// ===========================
const users = Router();
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
export default (client: Client) => {
  // -> Login
  users.post(
    '/login',
    [body('code').not().isEmpty().trim()],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      console.log({ code: req.body.code });

      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      try {
        const params = new URLSearchParams({
          client_id: discordClientID,
          client_secret: discordClientSecret,
          grant_type: 'authorization_code',
          code: req.body.code.toString(),
          redirect_uri: discordRedirectURI,
          scope: 'identify',
        });

        const resp = await axios.post(
          'https://discordapp.com/api/oauth2/token',
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );

        const accessToken: string = resp.data.access_token;

        const payload = { accessToken };

        let token = jwt.sign(payload, encryptionSecret, {
          expiresIn: '7d',
        });

        return res.status(200).json({ token });
      } catch (e) {
        console.log(e);
        return res.status(401).json();
      }
    },
  );

  // -> Authorize user
  users.post(
    '/auth',
    [validateUser(client)],
    async (req: Request, res: Response) => {
      return res.status(200).json({ user: req.user });
    },
  );

  return users;
};
// =========================== !SECTION
