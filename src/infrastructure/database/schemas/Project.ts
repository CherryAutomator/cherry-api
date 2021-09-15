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
    },
    description: {
      type: String,
    },
    color: {
      type: String,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    ownerId: {
      type: "uuid",
    },
  },
  relations: {
    owner: {
      type: "many-to-one",
      target: User.name,
    },
    releaseConfigurations: {
      type: "one-to-many",
      target: ReleaseConfiguration.name,
    },
  },
});
