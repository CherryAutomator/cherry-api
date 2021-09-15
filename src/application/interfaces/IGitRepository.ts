import { Project } from "../../domain/model/Project";
import { Tag } from "./IGitRepositoryHosting";

export type VersionIncrementType = "major" | "minor" | "patch";

export interface IGitRepository {
  clone(url: string): Promise<void>;
  merge(from: string, to: string): Promise<void>;
  tag(type: VersionIncrementType, branch: string): Promise<Tag>;
  push(branch: string): Promise<void>;
}