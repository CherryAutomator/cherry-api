import { UserService } from "../../application/services/UserService";
import { Get, Post } from "../utils/decorators";
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
  async getMe(_req: Request, res: Response<any>) {
    try {
      const user = await this.userService.getOne(getUserId(res));

      res.send({ content: format.user(user), message: 'User created successfull' });
    } catch (err) {
      return error(err, res);
    }
  }
}