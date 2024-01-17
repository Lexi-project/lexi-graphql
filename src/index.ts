import { ApolloServer } from "@apollo/server";
import { readFileSync } from "fs";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers";

const typeDefs = readFileSync("./src/schema.graphql", { encoding: "utf-8" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  status400ForVariableCoercionErrors: true,
});

const { url } = await startStandaloneServer(server, {
  context: async ({req, res}) => {
    return {
      resolvers,
      authToken: req.headers.authorization
    }
  },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
