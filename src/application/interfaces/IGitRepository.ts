import { Project } from "../../domain/model/Project";
import { Tag } from "./IGitRepositoryHosting";

export type VersionIncrementType = "major" | "minor" | "patch";

export interface IGitRepository {
  set(project: Project): Promise<void>;
  merge(from: string, to: string): Promise<void>;
  tag(type: VersionIncrementType, branch: string): Promise<Tag>;
  push(branch: string): Promise<void>;
}