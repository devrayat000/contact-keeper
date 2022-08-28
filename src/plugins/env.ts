import fp from "fastify-plugin";
import env, { fastifyEnvOpt } from "@fastify/env";

const schema = {
  type: "object",
  required: ["PORT", "NODE_ENV"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    NODE_ENV: {
      type: "string",
      default: "development",
    },
  },
};

export default fp<fastifyEnvOpt>(async (fastify, opts) => {
  void (await fastify.register(env, {
    dotenv: true,
    schema,
    ...opts,
  }));
});

declare module "fastify" {
  interface FastifyInstance {
    config: NodeJS.ProcessEnv;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV?: "development" | "test" | "production";
      readonly PORT?: number;
    }
  }
}
