import express from 'express';
import { createConnection, getConnectionOptions } from 'typeorm';
import { AuthenticationController } from './web/controllers/authentication';
import { ProjectsController } from './web/controllers/projects';
import { ReleasesController } from './web/controllers/releases';
import { UsersController } from './web/controllers/users';
import { getApplicationServices } from './web/services';
import { registerControllers } from './web/utils/decorators';

export const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

getConnectionOptions()
  .then(async options =>
    createConnection({
      ...options,
      migrationsRun: true,
    }),
  )
  .then(connection => {
    app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

    const { project, authentication, release, user } = getApplicationServices(connection);

    registerControllers(app, [
      new ProjectsController(project),
      new ReleasesController(release),
      new AuthenticationController(authentication),
      new UsersController(user),
    ]);
  })
  .catch(error => console.error(error));

