import { expressMiddleware } from "@as-integrations/express5";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import createApolloGraphqlServer from "./graphql/index.js";

dotenv.config();

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.use("/graphql", expressMiddleware(await createApolloGraphqlServer()));

  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

init();
