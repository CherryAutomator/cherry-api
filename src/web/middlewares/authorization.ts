import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { jwtSecret } from '../../infrastructure/providers/Jwt';
import { Http } from '@status/codes';

function decodeToken(authorizationHeader: string) {
  if (!authorizationHeader) throw new Error('You are not authenticated');

  const [, token] = authorizationHeader.split(' ');

  if (!token) throw new Error('You are not authenticated');

  return jwt.verify(token, jwtSecret) as jwt.JwtPayload;
}

export function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    res.locals["userId"] = decodeToken(req.headers.authorization).sub;

    next();
  } catch (error) {
    console.log('ERROO', error);
    res.status(Http.Unauthorized);
    res.send({ message: 'Invalid token' });
  }
}