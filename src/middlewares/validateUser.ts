import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import handleResponse from "./response";
import logger from "../utils/logger";
import { IGetUserAuthInfoRequest } from "../../types/express";
import UserService from "../modules/user/service";

dotenv.config();
let { JWT_SECRET_KEY } = process.env;

export interface decodepLoad {
  id: number;
  phone_number: string;
}

const validateUser = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization) {
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "Authorization token is invalid",
        },
        401
      );
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "Authorization token is missing",
        },
        401
      );
    }

    const decoded = jwt.verify(token, <any>JWT_SECRET_KEY) as decodepLoad;
    
    const users = await UserService.findUsers({
      id: decoded.id,
      phone_number: decoded.phone_number,
    });

    if (!users)
      return handleResponse(
        req,
        res,
        { status: "error", message: "Invalid phone number or password" },
        400
      );

    if (users.length === 0)
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "Unauthorized access",
        },
        401
      );
    const user = users[0]

    if (user.token !== token) {
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "Failed to authenticate user",
        },
        401
      );
    }

    if (!user.is_verified) {
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "User is not verified",
        },
        401
      );
    }

    if (user.is_blocked) {
      return handleResponse(
        req,
        res,
        {
          status: "error",
          message: "User is blocked",
        },
        401
      );
    }
    logger(module).info(
      `Logged in user - ${req.socket.remoteAddress}- ${req.originalUrl} - ${user.phone_number}`
    );
    req.user = user;
    next();
  } catch (error: any) {
    let message = error.message;
    let status = 500;
    if (error?.name === "TokenExpiredError") {
      message = "token expired. please login again";
      status = 401;
    } else if (error?.name === "JsonWebTokenError") {
      message = "invalid token";
      status = 401;
    }
    return handleResponse(
      req,
      res,
      {
        status: "error",
        message,
      },
      status
    );
  }
};

export default validateUser;
