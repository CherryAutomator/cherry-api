import { IUserRepository } from "../../domain/model/User";
import { Forbidden, InvalidArgument, NotFound } from "../../domain/shared/errors";
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

    if (!user) throw new InvalidArgument("O email ou a senha estão inválidos");

    const isEqual = await this.hasher.equals(password, user.password);

    if (!isEqual) throw new InvalidArgument("O email ou a senha estão inválidos");

    return {
      refreshToken: this.jwt.createRefreshToken(user),
      accessToken: this.jwt.createAccessToken(user),
    };
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwt.verify(refreshToken);

    if (!decoded.sub) {
      throw new Forbidden("O token é invalido");
    }

    const userId = decoded.sub;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFound("Usuário não encontrado");
    }

    return {
      refreshToken: this.jwt.createRefreshToken(user),
      accessToken: this.jwt.createAccessToken(user),
    };
  }
}