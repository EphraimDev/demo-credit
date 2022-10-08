import { Request } from "express";
import { UserInterface } from "../../src/database/types";

export interface IGetUserAuthInfoRequest extends Request {
  user?: UserInterface;
}
