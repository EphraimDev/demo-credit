import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { handleResponse } from "../../middlewares";

class TransactionValidator {
  static async fundAccountValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      amount: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error)
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        422
      );
    return next();
  }

  static async transferValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const schema = Joi.object({
      amount: Joi.number().required(),
      receiver: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        422
      );
    return next();
  }
}

export default TransactionValidator;
