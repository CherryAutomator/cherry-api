import { v1 } from "uuid";
import { IProjectRepository } from "../../domain/model/Project";
import { IReleaseConfigurationRepository, ReleaseConfiguration } from "../../domain/model/ReleaseConfiguration";
import { IUserRepository } from "../../domain/model/User";
import { PagingParams } from "../../domain/shared/pagination";
import { IGitRepository, VersionIncrementType } from "../interfaces/IGitRepository";
import { IGitRepositoryHosting } from "../interfaces/IGitRepositoryHosting";

export interface ReleaseCommand {
  releaseConfigId: string;
  type?: VersionIncrementType;
  tagName?: string;
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
    private readonly userRepository: IUserRepository,
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
    const { releaseConfigId, notes, type, tagName } = releaseCommand;

    const user = await this.userRepository.findById(userId);
    const configuration = await this.getReleaseConfiguration(releaseConfigId);
    configuration.project.validateOwner(userId);

    const remoteRepository = await this.repositoryHosting.getRemoteRepository(configuration.project.externalRepositoryId);

    console.log(`\n⏳ Cloning ${remoteRepository.url}`);

    await this.repository.clone(remoteRepository.url, configuration.project.id);

    console.log(` - 🔄 Merging ${configuration.branchFrom} into ${configuration.branchTo}`);

    await this.repository.merge({
      committerEmail: user.email,
      committerName: `${user.firstname} ${user.lastname}`,
      from: configuration.branchFrom,
      projectId: configuration.project.id,
      to: configuration.branchTo,
    });

    if (tagName) {
      let tagname = tagName;
  
      // if (type) {
      //   const { major, minor, patch } = this.repository.incrementPackageJson(type, configuration.project.id);
      //   tagname = `v${major}.${minor}.${patch}`;
      // }
  
      console.log(` - 📃 Creating tag (${tagName})`);
  
      await this.repository.tag(tagName, configuration.branchTo, configuration.project.id, notes);
    }


    console.log(" - 🔱 Pushing to", configuration.branchTo);

    await this.repository.push({
      branch: configuration.branchTo,
      personalAccessToken: user.accessToken,
      projectId:configuration.project.id,
      tagName: tagName,
    });

    console.log(" - ✅ Success!");

    if (tagName) {
      await this.repositoryHosting.newRelease({
        repoName: remoteRepository.name,
        owner: remoteRepository.owner,
        accessToken: user.accessToken,
        tag: tagName,
        notes,
      });
    }
  }
}