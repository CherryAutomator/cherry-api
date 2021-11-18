import { UserService } from "../../application/services/UserService";
import { Post } from "../utils/decorators";
import { Response } from "../utils/response";
import { Request } from "express";
import { error } from "../utils/errors";

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
}