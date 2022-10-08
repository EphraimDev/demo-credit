import { User } from "../../database";
import {
  UserCreateInterface,
  UserInterface,
  UserWhereInterface,
} from "../../database/types";

class UserService {
  static async addUserToDatabase(user: UserCreateInterface) {
    try {
      return User().insert(user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async findUsers(where: UserWhereInterface): Promise<UserInterface[]> {
    try {
      return User().where(where);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async updateUser(
    where: UserWhereInterface,
    input: UserWhereInterface
  ) {
    try {
      return User().where(where).update(input);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

export default UserService;
