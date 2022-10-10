import { Response } from "express";
import { IGetUserAuthInfoRequest } from "../../../types/express";
import { handleResponse } from "../../middlewares";
import WalletService from "./service";

class WalletController {
  static async getWalletDetails(req: IGetUserAuthInfoRequest, res: Response) {
    const user = req.user;
    if (!user)
      return handleResponse(
        req,
        res,
        { status: "error", message: "Unauthorized" },
        401
      );
    try {
      const accounts = await WalletService.findWallets({
        user_id: user.id,
      });
      if (!accounts)
        return handleResponse(
          req,
          res,
          { status: "error", message: "User wallet could not be fetched" },
          400
        );

      if (accounts.length === 0)
        return handleResponse(
          req,
          res,
          { status: "error", message: "User wallet could not be fetched" },
          400
        );

      return handleResponse(
        req,
        res,
        {
          status: "success",
          message: "User wallet details fetched successfully",
          data: accounts[0],
        },
        200
      );
    } catch (error: any) {
      return handleResponse(
        req,
        res,
        { status: "error", message: error.message },
        500
      );
    }
  }
}

export default WalletController;
