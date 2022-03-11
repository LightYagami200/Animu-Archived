// ===========================
// SECTION | IMPORTS
// ===========================
import { Request, Response, Router } from 'express';
// =========================== !SECTION

// ===========================
// SECTION | INIT
// ===========================
const apiVersion = 1;
const root = Router();
// =========================== !SECTION

// ===========================
// SECTION | MAIN
// ===========================
root.get('/', async (_req: Request, res: Response) => {
  res.status(200).json({
    version: apiVersion,
    acceptingRequests: true,
  });
});

// -> Export
export default root;
// =========================== !SECTION
