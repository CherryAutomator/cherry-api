import { EntitySchema } from "typeorm";
import { Project } from "../../../domain/model/Project";

export const ProjectSchema = new EntitySchema<Project>({
  name: "projects",
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
      target: "users",
    },
    releaseConfigurations: {
      type: "one-to-many",
      target: "release_configurations",
    },
  },
});
