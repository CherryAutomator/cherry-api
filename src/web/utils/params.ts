import { Response, Request } from 'express';

export function getUserId(res: Response) {
  return res.locals["userId"];
}

export function getPaging(req: Request) {
  const { amount, page } = req.query;

  return {
    amount: amount ? Number(amount) : 10, 
    page: page ? Number(page) : 1,
  }
}