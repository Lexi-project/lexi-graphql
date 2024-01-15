import type { Resolvers } from "./resolvers-types";

const resolvers: Resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
};

export default resolvers;
