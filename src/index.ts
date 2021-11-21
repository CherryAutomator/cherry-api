import express from 'express';
import { createConnection, getConnectionOptions } from 'typeorm';
import { AuthenticationController } from './web/controllers/authentication';
import { ProjectsController } from './web/controllers/projects';
import { ReleasesController } from './web/controllers/releases';
import { UsersController } from './web/controllers/users';
import { getApplicationServices } from './web/services';
import { registerControllers } from './web/utils/decorators';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');
import swaggerUI from 'swagger-ui-express';
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/v1', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

getConnectionOptions()
  .then(async options =>
    createConnection({
      ...options,
      migrationsRun: true,
    }),
  )
  .then(connection => {
    const { project, authentication, release, user } = getApplicationServices(connection);
    
    registerControllers(app, [
      new ProjectsController(project),
      new ReleasesController(release),
      new AuthenticationController(authentication),
      new UsersController(user),
    ]);

    const port = process.env.PORT || 3000;
    
    app.listen(port, () => console.log(`Listening at http://localhost:${port}/v1`));
  })
  .catch(error => console.error(error));

