// ===========================
// SECTION | IMPORTS
// ===========================
import { encryptionSecret } from '@keys';
import { UserModel } from '@models/users.model';
import { IUserDocument } from '@models/users.types';
import axios from 'axios';
import { Client } from 'discord.js';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
// -> Validate User
const validateUser =
  (client: Client) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token'];

    console.log({ token });

    if (!token)
      return res.status(403).send({ error: 'No token provided' });

    jwt.verify(token, encryptionSecret, async (err: any, decoded: any) => {
      if (err) return res.status(403).send({ error: 'Invalid token' });

      const { accessToken }: { accessToken: string } = decoded;

      try {
        const idRes = await axios.get(
          `https://discordapp.com/api/users/@me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        let user = (await UserModel.findOne({
          discordID: idRes.data.id,
        })) as IUserDocument | null;

        if (!user) user = await UserModel.createUser(idRes.data.id);

        const identity = {
          discord: idRes.data,
          user,
        };

        req.accessToken = accessToken;
        req.user = identity;

        next();
      } catch (e) {
        if (e)
          return res.status(403).send({ error: 'Discord Token expired' });
      }
    });
  };

export { validateUser };
// =========================== !SECTION
