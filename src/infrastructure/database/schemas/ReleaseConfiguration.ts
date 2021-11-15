import { EntitySchema } from "typeorm";
import { Project } from "../../../domain/model/Project";
import { ReleaseConfiguration } from "../../../domain/model/ReleaseConfiguration";

export const ReleaseConfigurationSchema = new EntitySchema<ReleaseConfiguration>({
  tableName: "release_configurations",
  name: ReleaseConfiguration.name,
  target: ReleaseConfiguration,
  columns: {
    id: {
      type: "uuid",
      primary: true,
    },
    name: {
      type: String,
      length: 20,
    },
    branchFrom: {
      type: String,
      length: 28,
    },
    branchTo: {
      type: String,
      length: 28,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    projectId: {
      type: "uuid",
    }
  },
  relations: {
    project: {
      type: "many-to-one",
      target: Project.name,
    },
  },
});
