import { ReleaseConfigurationResource } from "./releaseConfguration";
import { UserCompact } from "./user";

export interface ProjectResource {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  releaseConfigurations: ReleaseConfigurationResource[];
  user: UserCompact;
}