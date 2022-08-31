import fp from "fastify-plugin";
import type { AltairFastifyPluginOptions } from "altair-fastify-plugin";

export default fp<AltairFastifyPluginOptions>(async (fastify, opts) => {
  fastify.register(import("altair-fastify-plugin"), {
    path: "/altair",
    baseURL: "/altair/",
    // 'endpointURL' should be the same as the mercurius 'path'
    endpointURL: "/graphql",
    ...opts,
  });
});
