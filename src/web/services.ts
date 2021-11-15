import { Connection } from "typeorm";
import { AuthenticationService } from "../application/services/AuthenticationService";
import { ProjectService } from "../application/services/ProjectService";
import { ReleaseService } from "../application/services/ReleaseService";
import { UserService } from "../application/services/UserService";
import { ProjectRepository } from "../infrastructure/repositories/ProjectRepository";
import { ReleaseConfigurationRepository } from "../infrastructure/repositories/ReleaseConfigurationRepository";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { Bcrypt } from "../infrastructure/providers/Bcrypt";
import { Jwt } from "../infrastructure/providers/Jwt";
import { Github } from "../infrastructure/services/Github";
import { NodeGit } from "../infrastructure/utils/git";

export function getApplicationServices(connection: Connection) {
  const bcrypt = new Bcrypt();
  const jwt = new Jwt();

  return {
    project: new ProjectService(
      connection.getCustomRepository(ProjectRepository),
      connection.getCustomRepository(UserRepository),
    ),
    release: new ReleaseService(
      new NodeGit(),
      new Github(),
      connection.getCustomRepository(ReleaseConfigurationRepository),
      connection.getCustomRepository(ProjectRepository),
      connection.getCustomRepository(UserRepository),
    ),
    user: new UserService(
      connection.getCustomRepository(UserRepository),
      bcrypt,
      jwt,
    ),
    authentication: new AuthenticationService(
      connection.getCustomRepository(UserRepository),
      bcrypt,
      jwt,
    ),
  }
}