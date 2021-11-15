import { Project } from "../../domain/model/Project";
import { Tag } from "./IGitRepositoryHosting";

export type VersionIncrementType = "major" | "minor" | "patch";

export interface IGitRepository {
  clone(url: string, projectId: string): Promise<void>;
  merge(from: string, to: string, projectId: string): Promise<void>;
  incrementPackageJson(type: VersionIncrementType, projectId: string): Tag;
  tag(name: string, branchName: string, projectId: string, notes: string): Promise<void>;
  push(branch: string, projectId: string, tagName: string): Promise<void>;
}