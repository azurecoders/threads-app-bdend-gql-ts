import type {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../services/user.js";
import UserService from "../../services/user.js";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const token = await UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });
    return token;
  },
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;

      if (!id) throw new Error("User not logged in");

      const user = await UserService.getUserById(id);
      if (!user) throw new Error("User not found");

      return user;
    }
    throw new Error("User not logged in");
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
