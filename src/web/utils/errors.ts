import { Response } from "express";
import { InvalidArgument, NotFound } from "../../domain/shared/errors";

export function error(error: any, res: Response) {
  let statusCode = 500;

  if (error instanceof NotFound) {
    statusCode = 404;
  }

  if (error instanceof InvalidArgument) {
    statusCode = 400;
  }

  return res.status(statusCode).send({ message: error.message });
}