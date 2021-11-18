import { IUserRepository, User } from "../../domain/model/User";
import { InvalidArgument, NotFound } from "../../domain/shared/errors";
import { IHasher } from "../interfaces/IHasher";
import { IJwtProvider } from "../interfaces/IJwtProvider";

export interface CreateUserCommand {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly jwt: IJwtProvider,
  ) { }

  private createPassword(password: string) {
    return this.hasher.hash(password);
  }

  async create(command: CreateUserCommand) {
    const { email, firstname, lastname, password } = command;

    const createdPassword = await this.createPassword(password);

    const existentUser = await this.userRepository.findByEmail(email);

    if (existentUser) throw new InvalidArgument('There is already a user with this email');

    const createdUser = await this.userRepository.store(new User(firstname, lastname, email, createdPassword));

    return {
      refreshToken: this.jwt.createRefreshToken(createdUser),
      accessToken: this.jwt.createAccessToken(createdUser),
    };
  }

  async setupAcessToken(userId: string, accessToken: string) {
    const user = await this.userRepository.findById(userId);

    if (!accessToken) throw new InvalidArgument("accessToken is required");

    user.accessToken = accessToken;

    return user;
  }

  async delete(userId: string) {
    return this.userRepository.remove(userId);
  }

  async getOne(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFound("User not found");

    return user;
  }
}