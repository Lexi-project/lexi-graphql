import type { BorrowCreditResponse, Resolvers } from "./resolvers-types";
import client from "./client";
import { GraphQLError } from "graphql";

const resolvers: Resolvers = {
  Query: {
    exercise: async (parent, args, context, info) => {
      let borrowCredit: BorrowCreditResponse = {};
      try {
        const borrow = await context.resolvers.Mutation.BorrowCredit(
          parent,
          {
            input: { token: context.authToken, credits: 1 },
          },
          context,
          info
        );
        borrowCredit = borrow;
        const exercise = await client.callGrpcMethod<typeof args>(
          client.exerciseGrpcClient,
          "GetExerciseContent",
          args
        );
        await context.resolvers.Mutation.CommitCredit(
          parent,
          {
            input: { transaction_id: borrow.transaction_id },
          },
          context,
          info
        );
        return exercise;
      } catch (error: unknown) {
        if (borrowCredit.transaction_id) {
          await context.resolvers.Mutation.RollbackCredit(
            parent,
            {
              input: {
                token: context.authToken,
                transaction_id: borrowCredit.transaction_id,
              },
            },
            context,
            info
          );
        }
        throw new GraphQLError("Failed to generate content");
      }
    },
  },
  Mutation: {
    BorrowCredit: async (parent, args, context, info) => {
      try {
        return await client.callGrpcMethod<typeof args.input>(
          client.creditGrpcClient,
          "BorrowCredit",
          args.input
        );
      } catch (error) {
        throw new GraphQLError("Failed to borrow credit");
      }
    },
    CommitCredit: async (parent, args, context, info) => {
      try {
        return await client.callGrpcMethod<typeof args.input>(
          client.creditGrpcClient,
          "CommitCredit",
          args.input
        );
      } catch (error) {
        throw new GraphQLError("Failed to commit credit");
      }
    },
    RollbackCredit: async (parent, args, context, info) => {
      try {
        return await client.callGrpcMethod<typeof args.input>(
          client.creditGrpcClient,
          "RollbackCredit",
          args.input
        );
      } catch (error) {
        throw new GraphQLError("Failed to rollback credit");
      }
    },
  },
};

export default resolvers;
