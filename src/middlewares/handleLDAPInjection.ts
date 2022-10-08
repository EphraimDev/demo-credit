import { NextFunction, Request, Response } from "express";
import handleResponse from "./response";

const hasLDAP = (value: string) => {
  if (value === null || value === undefined) {
    return false;
  }

  let ldap = /[&*();,\\|=]/;
  if (ldap.test(value)) {
    return true;
  }

  return false;
};

const handleLDAPInjection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let containLDAP = false;
  let body = req.body;
  let query = req.query;
  //check for LDAP injection in the body request
  if (body !== null && body !== undefined) {
    for (const key in body) {
      if (Object.hasOwnProperty.call(body, key)) {
        const val = body[key];
        if (hasLDAP(val) === true) {
          containLDAP = true;
          break;
        }
      }
    }
  }
  //check for ldap injection in the queries
  if (!containLDAP)
    if (query !== null && query !== undefined) {
      for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
          const val = query[key];
          if (!val) {
            continue;
          }
          if (hasLDAP(val.toString()) === true) {
            containLDAP = true;
            break;
          }
        }
      }
    }

  if (containLDAP) {
    return handleResponse(
      req,
      res,
      {
        status: "error",
        message: "LDAP Detected in Request, Rejected.",
      },
      403
    );
  } else {
    next();
  }
};

export default handleLDAPInjection;
