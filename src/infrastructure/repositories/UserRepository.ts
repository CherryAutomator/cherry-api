import { AbstractRepository, EntityRepository, FindOneOptions } from "typeorm";
import { IUserRepository, User } from "../../domain/model/User";
import { UserSchema } from "../database/schemas/User";

@EntityRepository(UserSchema)
export class UserRepository extends AbstractRepository<User> implements IUserRepository {
  store(user: User): Promise<User> {
    return this.repository.save(user);
  }

  findById(id: string, options: FindOneOptions): Promise<User> {
    return this.repository.findOne(id, options);
  }

  findByEmail(email: string, options?: FindOneOptions): Promise<User> {
    return this.repository.findOne({
      where: { email },
      relations: options ? options.relations: [],
    });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}