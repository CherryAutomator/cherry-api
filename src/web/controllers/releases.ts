import { ReleaseService } from "../../application/services/ReleaseService";
import { Express, Request } from "express";

export class ReleasesController {
  constructor(
    private readonly releaseService: ReleaseService,
    private readonly app: Express
  ) { }
}