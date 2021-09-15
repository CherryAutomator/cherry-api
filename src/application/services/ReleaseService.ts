import { v1 } from "uuid";
import { IProjectRepository } from "../../domain/model/Project";
import { IReleaseConfigurationRepository, ReleaseConfiguration } from "../../domain/model/ReleaseConfiguration";
import { PagingParams } from "../../domain/shared/pagination";
import { IGitRepository, VersionIncrementType } from "../interfaces/IGitRepository";
import { IGitRepositoryHosting } from "../interfaces/IGitRepositoryHosting";

export interface ReleaseCommand {
  releaseConfigId: string;
  type: VersionIncrementType;
  notes: string;
}

export interface SimpleMergeCommand {
  projectId: string;
  from: string;
  to: string;
}

export interface CreateReleaseConfigurationCommand {
  name: string;
  branchFrom: string;
  branchTo: string;
  projectId: string;
}

export interface EditReleaseConfigurationCommand {
  id: string;
  name: string;
  branchFrom: string;
  branchTo: string;
}

export class ReleaseService {
  constructor(
    private readonly repository: IGitRepository,
    private readonly repositoryHosting: IGitRepositoryHosting,
    private readonly releaseConfigurationRepository: IReleaseConfigurationRepository,
    private readonly projectRepository: IProjectRepository,
  ) { }

  async createReleaseConfiguration(userId: string, command: CreateReleaseConfigurationCommand) {
    const { name, branchFrom, branchTo, projectId } = command;

    const project = await this.projectRepository.findById(projectId);

    console.log(project);

    if (!project) {
      throw new Error("Project not found");
    }

    project.validateOwner(userId);
    
    return this.releaseConfigurationRepository.store(new ReleaseConfiguration(name, branchFrom, branchTo, project));
  }

  async editReleaseConfiguration(userId: string, command: EditReleaseConfigurationCommand) {
    const { id, name, branchFrom, branchTo } = command;

    const releaseConfiguration = await this.releaseConfigurationRepository.findById(id, { relations: ["project"] });

    if (!releaseConfiguration) {
      throw new Error("Release configuration not found");
    }

    releaseConfiguration.project.validateOwner(userId);
    releaseConfiguration.branchFrom = branchFrom;
    releaseConfiguration.branchTo = branchTo;
    releaseConfiguration.name = name;
    
    return this.releaseConfigurationRepository.store(releaseConfiguration);
  }

  async getReleaseConfigurationsFromProject(userId: string, projectId: string, pagingParams: PagingParams) {
    const project = await this.projectRepository.findById(projectId);

    project.validateOwner(userId);

    return this.releaseConfigurationRepository.findByProject(projectId, pagingParams);
  }

  async deleteReleaseConfiguration(userId: string, id: string) {
    const releaseConfiguration = await this.releaseConfigurationRepository.findById(id, { relations: ["project"] });

    releaseConfiguration.project.validateOwner(userId);

    return this.releaseConfigurationRepository.remove(id);
  }

  async getReleaseConfiguration(id: string) {
    const releaseConfiguration = await this.releaseConfigurationRepository.findById(id, { relations: ["project"] });

    if (!releaseConfiguration) {
      throw new Error("Release configuration not found");
    }

    return releaseConfiguration;
  }

  async createRelease(userId: string, releaseCommand: ReleaseCommand) {
    const { releaseConfigId, notes, type } = releaseCommand;

    const configuration = await this.getReleaseConfiguration(releaseConfigId);

    configuration.project.validateOwner(userId);

    const cloneURL = await this.repositoryHosting.getCloneURL(configuration.project.externalRepositoryId);

    await this.repository.clone(cloneURL);
    await this.repository.merge(configuration.branchFrom, configuration.branchTo);

    const tag = await this.repository.tag(type, configuration.branchTo);

    await this.repository.push(configuration.branchTo);
    await this.repositoryHosting.newRelease({ branch: configuration.branchTo, notes, tag });
  }

  // async createStagingRelease(userId: string, releaseConfigurationId: string) {
  //   const configuration = await this.getReleaseConfig(releaseConfigurationId);
  //   configuration.project.validateOwner(userId);
    
  //   await this.repository.set(configuration.project);
  //   await this.repository.merge(configuration.branchFrom, configuration.branchTo);
  //   await this.repository.push(configuration.branchTo);
  // }
}