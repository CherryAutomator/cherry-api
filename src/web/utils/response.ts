import { Request, Response as ExpressResponse } from "express";

interface IResponse<T> {
  message?: string;
  content?: T;
}

export type Response<T> = ExpressResponse<IResponse<T>>;