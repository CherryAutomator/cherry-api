import { User } from "../../domain/model/User";

interface JwtPayload {
  iss?: string | undefined;
  sub?: string | undefined;
}

export interface IJwtProvider {
  createAccessToken(user: User): string;
  createRefreshToken(user: User): string;
  verify(token: string): JwtPayload;
}