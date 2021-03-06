import { ReleaseService } from "../../application/services/ReleaseService";
import { Request } from "express";
import { Authorize, Delete, Get, Post, Put } from "../utils/decorators";
import { Response } from "../utils/response";
import { Paged } from "../../domain/shared/pagination";
import { ReleaseConfiguration } from "../../domain/model/ReleaseConfiguration";
import { getPaging, getUserId } from "../utils/params";
import { error } from "../utils/errors";

export class ReleasesController {
  constructor(private readonly releaseService: ReleaseService) { }

  @Authorize()
  @Get('/projects/:id/release-configurations')
  async getReleaseConfigurationsFromProject(req: Request<{ id: string }>, res: Response<Paged<ReleaseConfiguration>>) {
    try {
      const releaseConfigurations = await this.releaseService.getReleaseConfigurationsFromProject(
        getUserId(res),
        req.params.id,
        getPaging(req),
      );

      return res.send({ content: releaseConfigurations });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Get('/release-configurations/:id')
  async getReleaseConfiguration(req: Request<{ id: string }>, res: Response<ReleaseConfiguration>) {
    try {
      const releaseConfiguration = await this.releaseService.getReleaseConfiguration(req.params.id);

      return res.send({ content: releaseConfiguration });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Post('/release-configurations/')
  async createReleaseConfiguration(req: Request, res: Response<ReleaseConfiguration>) {
    try {
      const created = await this.releaseService.createReleaseConfiguration(getUserId(res), req.body);

      return res.send({ content: created, message: 'Created successfully' });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Put('/release-configurations/:id')
  async editReleaseConfiguration(req: Request<{ id: string }>, res: Response<ReleaseConfiguration>) {
    try {
      const edited = await this.releaseService.editReleaseConfiguration(getUserId(res), {
        ...req.body,
        id: req.params.id,
      });

      return res.send({ content: edited,  message: 'Edited successfully' });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Delete('/release-configurations/:id')
  async deleteReleaseConfiguration(req: Request<{ id: string }>, res: Response<ReleaseConfiguration>) {
    try {
      await this.releaseService.deleteReleaseConfiguration(getUserId(res), req.params.id);

      return res.send({ message: 'Deleted successfully' });
    } catch (err) {
      return error(err, res);
    }
  }

  @Authorize()
  @Post('/release-configurations/:id/releases')
  async newRelease(req: Request<{ id: string }>, res: Response<ReleaseConfiguration>) {
    try {
      await this.releaseService.createRelease(getUserId(res), {
        releaseConfigId: req.params.id,
        notes: req.body.notes,
        tagName: req.body.tagName,
      });

      return res.send({ message: 'Project released successfully' });
    } catch (err) {
      console.log(err);
      return error(err, res);
    }
  }
}