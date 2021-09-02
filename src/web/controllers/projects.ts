import { Request } from "express";
import { ProjectResource } from "../../application/dtos/project";
import { ProjectService } from "../../application/services/ProjectService";
import { ReleaseService } from "../../application/services/ReleaseService";
import { Project } from "../../domain/model/Project";
import { ReleaseConfiguration } from "../../domain/model/ReleaseConfiguration";
import { Paged } from "../../domain/shared/pagination";
import { Authorize, Delete, Get, Post, Put } from "../utils/decorators";
import { Response } from "../utils/response";

export class ProjectsController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly releaseService: ReleaseService,
  ) { }

  @Authorize()
  @Get('/projects/:id/release-configurations')
  async getProjectReleaseConfigurations(req: Request<{ id: string }>, res: Response<Paged<ReleaseConfiguration>>) {
    try {
      const releaseConfigurations = await this.releaseService.getReleaseConfigurationsFromProject(res.locals["userId"], req.params.id);

      return res.send({ content: releaseConfigurations });
    } catch ({ message }) {
      return res.send({ message: message });
    }
  }

  @Get('/projects/:id')
  async getProject(req: Request<{ id: string }>, res: Response<Project>) {
    try {
      const project = await this.projectService.getProject(res.locals["userId"], req.params.id);

      return res.send({ content: project });
    } catch ({ message }) {
      return res.send({ message: message });
    }
  }

  @Authorize()
  @Get('/me/projects')
  async getProjectsFromUser(req: Request<{ id: string }>, res: Response<Paged<ProjectResource>>) {
    try {
      const { amount, page } = req.query;

      const projects = await this.projectService.getProjects(res.locals["userId"], {
        amount: Number(amount),
        page: Number(page),
      });

      return res.send({ content: projects });
    } catch ({ message }) {
      return res.send({ message: message });
    }
  }

  @Post('/projects')
  async create(req: Request, res: Response<Project>) {
    try {
      const created = await this.projectService.createProject(res.locals["userId"], req.body);
      
      res.send({ content: created, message: 'Project created successfully' });
    } catch ({ message }) {
      res.send({ message });
    }
  }

  @Put('/projects/:id')
  async edit(req: Request<{ id: string }>, res: Response<Project>) {
    try {
      const { color, description, name } = req.body;

      const edited = await this.projectService.editProject(res.locals["userId"], {
        id: req.params.id,
        name,
        description,
        color,
      });
      
      res.send({ content: edited, message: 'Project edited successfully' });
    } catch ({ message }) {
      res.send({ message });
    }
  }

  @Delete('/projects/:id')
  async delete(req: Request<{ id: string }>, res: Response<Project>) {
    try {
      await this.projectService.deleteProject(res.locals["userId"], req.params.id);
      
      res.send({ content: null, message: 'Project deleted successfully' });
    } catch ({ message }) {
      res.send({ message });
    }
  }
}
