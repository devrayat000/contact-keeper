declare module "graphql-upload/GraphQLUpload.js" {
  import type { GraphQLScalarType } from "graphql";
  import type { UploadType } from "../graphql-upload";

  const GraphQLUpload: GraphQLScalarType<UploadType, never>;
  export default GraphQLUpload;
}

declare module "graphql-upload/processRequest.js" {
  import { processRequest } from "graphql-upload";
  export default processRequest;
}
