import { User } from "../../database";
import {
  UserCreateInterface,
  UserInterface,
  UserWhereInterface,
} from "../../database/types";

class UserService {
  static async addUserToDatabase(
    payload: UserCreateInterface
  ): Promise<number[] | null> {
    try {
      const user = await User().insert(payload);
      return user;
    } catch (error: any) {
      return null;
    }
  }

  static async findUsers(
    where: UserWhereInterface
  ): Promise<UserInterface[] | null> {
    try {
      const user = await User().where(where);
      return user;
    } catch (error: any) {
      return null;
    }
  }

  static async updateUser(
    where: UserWhereInterface,
    input: UserWhereInterface
  ): Promise<number | null> {
    try {
      const user = await User().where(where).update(input);
      return user;
    } catch (error: any) {
      return null;
    }
  }
}

export default UserService;
