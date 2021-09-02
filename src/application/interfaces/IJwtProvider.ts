import { User } from "../../domain/model/User";

export interface IJwtProvider {
  createAccessToken(user: User): string;
  createRefreshToken(user: User): string;
}