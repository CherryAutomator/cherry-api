import { IUserRepository } from "../../domain/model/User";
import { IHasher } from "../interfaces/IHasher";
import { IJwtProvider } from "../interfaces/IJwtProvider";

export class AuthenticationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly jwt: IJwtProvider,
  ) { }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error("The email or password are invalid.");

    const isEqual = await this.hasher.equals(password, user.password);

    if (!isEqual) throw new Error("The email or password are invalid.");

    return {
      refreshToken: this.jwt.createRefreshToken(user),
      accessToken: this.jwt.createAccessToken(user),
    };
  }
}