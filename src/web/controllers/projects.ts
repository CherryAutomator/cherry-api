import { Request } from "express";
import { ProjectService } from "../../application/services/ProjectService";
import { Project } from "../../domain/model/Project";
import { Paged } from "../../domain/shared/pagination";
import { Authorize, Delete, Get, Post, Put } from "../utils/decorators";
import { error } from "../utils/errors";
import { format } from "../utils/mapper";
import { getPaging, getUserId } from "../utils/params";
import { Response } from "../utils/response";

export class ProjectsController{
  constructor(private readonly projectService: ProjectService) { }

  @Authorize()
  @Get('/projects/:id')
  async getProject(req: Request<{ id: string }>, res: Response<any>) {
    try {
      const project = await this.projectService.getProject(getUserId(res), req.params.id);

      return res.send({ content: format.project(project) });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Get('/me/projects')
  async getProjectsFromUser(req: Request<{ id: string }>, res: Response<Paged<any>>) {
    try {
      const { data, total } = await this.projectService.getProjects(getUserId(res), getPaging(req));

      console.log(data);

      return res.send({
        content: {
          data: data.map(project => format.project(project)),
          total,
        }
      });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Post('/projects')
  async create(req: Request, res: Response<any>) {
    try {
      const created = await this.projectService.createProject(getUserId(res), req.body);
      
      res.send({ content: format.project(created), message: 'Project created successfully' });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Put('/projects/:id')
  async edit(req: Request<{ id: string }>, res: Response<any>) {
    try {
      const { color, description, name } = req.body;

      const edited = await this.projectService.editProject(getUserId(res), {
        id: req.params.id,
        name,
        description,
        color,
      });
      
      res.send({
        content: format.project(edited),
        message: 'Project edited successfully',
      });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Delete('/projects/:id')
  async delete(req: Request<{ id: string }>, res: Response<any>) {
    try {
      await this.projectService.deleteProject(getUserId(res), req.params.id);
      
      res.send({ content: null, message: 'Project deleted successfully' });
    } catch (err) {
      return error(err, res);
    }
  }
}
