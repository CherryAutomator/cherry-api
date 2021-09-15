import { EntitySchema } from "typeorm";
import { Project } from "../../../domain/model/Project";
import { User } from "../../../domain/model/User";

export const UserSchema = new EntitySchema<User>({
  tableName: "users",
  name: User.name,
  target: User,
  columns: {
    id: {
      type: "uuid",
      primary: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    accessToken: {
      type: String,
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    projects: {
      type: "one-to-many",
      target: Project.name,
    },
  },
});
