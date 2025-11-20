import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String!): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello World",
        say: (_, { name }) => `Hello ${name}`,
      },
    },
  });

  await server.start();

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  app.use("/graphql", expressMiddleware(server));

  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}

init();
