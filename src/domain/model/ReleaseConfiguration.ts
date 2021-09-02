import { QueryOptions } from "../shared/mapping";
import { Paged, PagingParams } from "../shared/pagination";
import { Project } from "./Project";

export interface IReleaseConfigurationRepository {
  store(releaseConfiguration: ReleaseConfiguration): Promise<ReleaseConfiguration>;
  findById(id: string, options?: QueryOptions): Promise<ReleaseConfiguration | undefined>;
  findByProject(projectId: string, params: PagingParams, options?: QueryOptions): Promise<Paged<ReleaseConfiguration>>
  remove(id: string): Promise<void>;
}

export class ReleaseConfiguration {
  id: string;
  name: string;
  branchFrom: string;
  branchTo: string;
  createdAt: Date;
  projectId: string;
  project: Project;

  constructor(name: string, branchFrom: string, branchTo: string, project: Project) {
    this.createdAt = new Date();
    this.name = name;    
    this.branchFrom = branchFrom;    
    this.branchTo = branchTo;    
    this.project = project;    
  }
}