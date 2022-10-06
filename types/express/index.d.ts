import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    token?: string;
    created_at: Date;
    updated_at: Date;
  };
}
