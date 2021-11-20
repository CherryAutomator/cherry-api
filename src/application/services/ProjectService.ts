import { IProjectRepository, Project } from "../../domain/model/Project";
import { IUserRepository } from "../../domain/model/User";
import { NotFound } from "../../domain/shared/errors";
import { Paged, PagingParams } from "../../domain/shared/pagination";

export interface CreateProjectCommand {
  name: string;
  description: string;
  color: string;
  externalRepositoryId: string;
}

export interface EditProjectCommand {
  id: string;
  name: string;
  description: string;
  color: string;
}

export class ProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly userRepository: IUserRepository,
  ) { }

  async createProject(userId: string, command: CreateProjectCommand) {
    const { name, color, description, externalRepositoryId } = command;

    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFound('The user does not exists');

    return this.projectRepository.store(new Project(name, description, color, user, externalRepositoryId));
  }

  async editProject(userId: string, command: EditProjectCommand) {
    const project = await this.projectRepository.findById(command.id);

    if (!project) throw new NotFound("Project not found");

    project.validateOwner(userId);

    project.name = command.name;
    project.color = command.color;
    project.description = command.description;

    return this.projectRepository.store(project);
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) throw new NotFound("Project not found");

    project.validateOwner(userId);

    return this.projectRepository.remove(projectId);
  }

  async getProject(userId: string, projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) throw new NotFound("Project not found");

    project.validateOwner(userId);

    return project;
  }

  async getProjects(userId: string, pagingParams: PagingParams): Promise<Paged<Project>> {
    return this.projectRepository.findByUser(userId, pagingParams);
  }
}