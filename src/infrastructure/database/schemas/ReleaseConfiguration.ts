import { EntitySchema } from "typeorm";
import { ReleaseConfiguration } from "../../../domain/model/ReleaseConfiguration";

export const ReleaseConfigurationSchema = new EntitySchema<ReleaseConfiguration>({
  name: "release_configurations",
  columns: {
    id: {
      type: "uuid",
      primary: true,
    },
    name: {
      type: String,
    },
    branchFrom: {
      type: String,
    },
    branchTo: {
      type: String,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    project: {
      type: "many-to-one",
      target: "projects",
    },
  },
});
