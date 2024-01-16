import dotenv from "dotenv";
import {
  loadPackageDefinition,
  credentials,
  ServiceClientConstructor,
} from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config();

interface ClientConfig {
  protoPath: string;
  packageName: "content";
  serviceName: "ExerciseContentService";
  hostPath: string;
}

const generateGrpcClient = (clientConfig: ClientConfig) => {
  const { protoPath, packageName, serviceName, hostPath } = clientConfig;
  console.log("host", hostPath);
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

export default { exerciseGrpcClient };
