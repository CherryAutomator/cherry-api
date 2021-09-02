import { EntitySchema } from "typeorm";
import { User } from "../../../domain/model/User";

export const UserSchema = new EntitySchema<User>({
  name: "users",
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
      target: "projects",
    },
  },
});
