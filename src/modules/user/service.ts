import { User } from "../../database";
import { UserCreateInterface, UserWhereInterface } from "../../database/types";

class UserService {
  static async addUserToDatabase(user: UserCreateInterface) {
    try {
      return User().insert(user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async findUsers(where: UserWhereInterface) {
    try {
      console.log(where);

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
