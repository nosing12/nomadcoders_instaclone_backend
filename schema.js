import path from "path";
import url from "url";
import { loadFiles } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadedTypeDefs = await loadFiles(`${__dirname}/**/*.typeDefs.js`, {
  ignoreIndex: true,
  requireMethod: async (path) => {
    return await import(url.pathToFileURL(path));
  },
});
const loadedResolvers = await loadFiles(
  `${__dirname}/**/*.{queries,mutations}.js`,
  {
    ignoreIndex: true,
    requireMethod: async (path) => {
      return await import(url.pathToFileURL(path));
    },
  }
);

const typeDefs = mergeTypeDefs(loadedTypeDefs);
const resolvers = mergeResolvers(loadedResolvers);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
