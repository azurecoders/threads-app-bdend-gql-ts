import { prisma } from "../lib/db.js";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string | null | undefined;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    return hashedPassword;
  }

  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;

    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);

    return prisma.user.create({
      data: {
        firstName,
        lastName: lastName || "",
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;

    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const userSalt = user.salt;
    const userHashedPassword = UserService.generateHash(userSalt, password);

    if (userHashedPassword !== user.password)
      throw new Error("Invalid password");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!
    );

    return token;
  }
}

export default UserService;
