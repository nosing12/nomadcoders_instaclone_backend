import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import pkg from "body-parser";
const { json } = pkg;
import { typeDefs, resolvers } from "./schema.js";
import { getUser } from "./users/users.utils.js";
import logger from "morgan";

const app = express();
const PORT = process.env.PORT;
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(logger("tiny"));

app.use(
  "/graphql",
  cors(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      };
    },
  })
);

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
