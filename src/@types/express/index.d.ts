import { IUserDocument } from '@models/users.types';

export {};

declare global {
  namespace Express {
    interface Request {
      accessToken: string;
      user: identity;
    }
  }
}

interface identity {
  discord: {
    id: string;
  };
  user: IUserDocument;
}
