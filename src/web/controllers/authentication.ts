import { Request } from "express";
import { AuthenticationService } from "../../application/services/AuthenticationService";
import { Post } from "../utils/decorators";
import { error } from "../utils/errors";
import { Response } from "../utils/response";

export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('/auth')
  async authenticate(req: Request, res: Response<any>) {
    try {
      const { email, password } = req.body;
      const tokens = await this.authenticationService.authenticate(email, password);

      res.send({ content: tokens, message: 'Successfully authenticated' });
    } catch (err) {
      return error(err, res);
    }
  }
}