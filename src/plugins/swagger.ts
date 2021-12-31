import fp from "fastify-plugin";
import swagger, { SwaggerOptions } from "fastify-swagger";

export default fp<SwaggerOptions>(async (fastify, _opts) => {
  void (await fastify.register(swagger, {
    mode: "dynamic",
    // routePrefix: "/api/docs",
    swagger: {
      info: {
        title: "Test swagger",
        description: "testing the fastify swagger api",
        version: "0.1.0",
      },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
    hideUntagged: true,
    exposeRoute: true,
  }));
});
