import type { GetExerciseContentResponse, Resolvers } from "./resolvers-types";
import clients from "./client";

const resolvers: Resolvers = {
  Query: {
    exercise: async (parent, args, context, info) => {
      try {
        const response = await new Promise((resolve, reject) => {
          clients.exerciseGrpcClient.GetExerciseContent(
            args.input,
            (error, response: GetExerciseContentResponse) => {
              if (error) {
                reject(error);
                throw new Error('Failed to create exercise');
              } else {
                resolve(response);
              }
            }
          );
        });
        return response;
      } catch (error: unknown) {
        throw new Error("Failed to create exercise");
      }
    },
  },
};

export default resolvers;
