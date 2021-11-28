import { UserService } from "../../application/services/UserService";
import { Authorize, Get, Post } from "../utils/decorators";
import { Response } from "../utils/response";
import { Request } from "express";
import { error } from "../utils/errors";
import { getUserId } from "../utils/params";
import { format } from "../utils/mapper";

export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Post('/users')
  async createUser(req: Request, res: Response<{ accessToken: string; refreshToken: string }>) {
    try {
      const tokens = await this.userService.create(req.body);

      res.send({ content: tokens, message: 'User created successfull' });
    } catch (err) {
      return error(err, res);
    }
  }

  @Get('/me')
  @Authorize()
  async getMe(_req: Request, res: Response<any>) {
    try {
      const user = await this.userService.getOne(getUserId(res));

      res.send({ content: format.user(user), message: 'User created successfull' });
    } catch (err) {
      return error(err, res);
    }
  }

  @Post('/me/access-token')
  @Authorize()
  async setupAccessToken(req: Request, res: Response<any>) {
    try {
      await this.userService.setupAcessToken(getUserId(res), req.body.accessToken);

      res.send({ content: null, message: 'Access token configurated successfuly' });
    } catch (err) {
      return error(err, res);
    }
  }
}