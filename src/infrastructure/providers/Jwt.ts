import { IJwtProvider } from "../../application/interfaces/IJwtProvider";
import { User } from "../../domain/model/User";
import jwt from 'jsonwebtoken';

export const jwtSecret = 'aaaaaaaaaaa';

export class Jwt implements IJwtProvider {
  private readonly oneHour = Math.floor(Date.now() / 1000) + (60 * 60);

  createAccessToken(user: User) {
    return jwt.sign({
      exp: this.oneHour,
      sub: user.id,
    }, jwtSecret);
  }

  createRefreshToken(user: User) {
    return jwt.sign({
      exp: this.oneHour,
      sub: user.id,
    }, jwtSecret);
  }
}