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
    firstname: {
      type: String,
      length: 30,
    },
    lastname: {
      type: String,
      length: 30,
    },
    email: {
      type: String,
      length: 50,
    },
    password: {
      type: String,
      length: 75,
    },
    accessToken: {
      type: String,
      nullable: true,
      length: 128,
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
