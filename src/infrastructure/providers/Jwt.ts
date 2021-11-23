import { IJwtProvider } from "../../application/interfaces/IJwtProvider";
import { User } from "../../domain/model/User";
import jwt from 'jsonwebtoken';

export const jwtSecret = 'aaaaaaaaaaa';

export class Jwt implements IJwtProvider {
  createAccessToken(user: User) {
    return jwt.sign({}, jwtSecret, {
      subject: user.id,
      expiresIn: '1h',
    });
  }

  verify(token: string) {
    return jwt.verify(token, jwtSecret) as jwt.JwtPayload;
  }

  createRefreshToken(user: User) {
    return jwt.sign({}, jwtSecret, {
      subject: user.id,
      expiresIn: "30d",
    });
  }
}