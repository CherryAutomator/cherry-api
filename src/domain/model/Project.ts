import { v4 as uuidv4 } from "uuid";
import { QueryOptions } from "../shared/mapping";
import { Paged, PagingParams } from "../shared/pagination";
import { ReleaseConfiguration } from "./ReleaseConfiguration";
import { User } from "./User";

export interface IProjectRepository {
  store(project: Project): Promise<Project>;
  findById(projectId: string, options?: QueryOptions): Promise<Project | undefined>;
  findByUser(userId: string, params: PagingParams, options?: QueryOptions): Promise<Paged<Project>>;
  remove(id: string): Promise<void>;
}

export class Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  externalRepositoryId: string;
  releaseConfigurations: ReleaseConfiguration[];
  user: User;
  userId: string;

  validateOwner(userId: string) {
    if (this.userId !== userId) {
      throw new Error("The user is not the project owner");
    }
  }

  constructor(name: string, description: string, color: string, user: User, externalRepositoryId: string) {
    this.id = uuidv4();
    this.createdAt = new Date();
    this.name = name;
    this.description = description;
    this.color = color;
    this.user = user;
    this.externalRepositoryId = externalRepositoryId;
  }
}
