import { expressMiddleware } from "@as-integrations/express5";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import createApolloGraphqlServer from "./graphql/index.js";
import UserService from "./services/user.js";

dotenv.config();

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        // @ts-ignore
        const token = req.headers["authorization"] as string;
        try {
          const user = UserService.decodeJwtToken(token!);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

init();
