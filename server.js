import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "./schema.js";
import { getUser } from "./users/users.utils.js";

const server = new ApolloServer({
  schema,
});

const PORT = process.env.PORT;

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    };
  },
});

console.log(`🚀  Server ready at: ${url}`);
