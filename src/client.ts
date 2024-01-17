import dotenv from "dotenv";
import {
  loadPackageDefinition,
  credentials,
  ServiceClientConstructor,
} from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { ServiceClient } from "@grpc/grpc-js/build/src/make-client";

dotenv.config();

interface ClientConfig {
  protoPath: string;
  packageName: "content" | "credit";
  serviceName: "ExerciseContentService" | "CreditService";
  hostPath: string;
}

const generateGrpcClient = (clientConfig: ClientConfig) => {
  const { protoPath, packageName, serviceName, hostPath } = clientConfig;
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  const service = loadPackageDefinition(packageDefinition)[packageName][
    serviceName
  ] as ServiceClientConstructor;

  return new service(hostPath, credentials.createInsecure());
};

const exerciseGrpcClient = generateGrpcClient({
  protoPath: "../lexi-proto/services/content_service/exercises.proto",
  packageName: "content",
  serviceName: "ExerciseContentService",
  hostPath: process.env.CONTENT_SERVICE_HOST,
});

const creditGrpcClient = generateGrpcClient({
  protoPath: "../lexi-proto/services/user_service/credit.proto",
  packageName: "credit",
  serviceName: "CreditService",
  hostPath: process.env.CREDIT_SERVICE_HOST,
});

const callGrpcMethod = async <T>(
  client: ServiceClient,
  methodName: string,
  args: T
) => {
  return await new Promise((resolve, reject) => {
    client[methodName](args, (error, response) => {
      if (error) {
        console.log(error)
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

export default { exerciseGrpcClient, creditGrpcClient, callGrpcMethod };
