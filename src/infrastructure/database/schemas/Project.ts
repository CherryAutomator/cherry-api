import { EntitySchema } from "typeorm";
import { Project } from "../../../domain/model/Project";
import { ReleaseConfiguration } from "../../../domain/model/ReleaseConfiguration";
import { User } from "../../../domain/model/User";

export const ProjectSchema = new EntitySchema<Project>({
  tableName: "projects",
  name: Project.name,
  target: Project,
  columns: {
    id: {
      type: "uuid",
      primary: true,
    },
    name: {
      type: String,
      length: 30,
    },
    description: {
      type: String,
      length: 128,
    },
    color: {
      type: String,
      length: 20,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    userId: {
      type: "uuid",
    },
    externalRepositoryId: {
      type: String,
      length: 60,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: User.name,
    },
    releaseConfigurations: {
      type: "one-to-many",
      target: ReleaseConfiguration.name,
    },
  },
});
