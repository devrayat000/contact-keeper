import fp from "fastify-plugin";
import { type MercuriusOptions } from "mercurius";
import { makeSchema } from "nexus";
import Scalars from "nexus-prisma/scalars";

import { contactQuery, contactType } from "../graphql/schema";
import { createContext } from "../utils/gql-context";

const schema = makeSchema({
  types: [Scalars, contactType, contactQuery],
  outputs: {
    schema: __dirname + "/../../schema.graphql",
    typegen: __dirname + "/../../src/graphql/generated/nexus.d.ts",
  },
  contextType: {
    module: __dirname + "/../../src/utils/gql-context.ts",
    export: "Context",
  },
});

export default fp<MercuriusOptions>(async (fastify, opts) => {
  fastify
    .register(import("mercurius"), {
      schema,
      context(request, reply) {
        return {
          ...createContext(request, reply),
          prisma: fastify.prisma,
        };
      },
      subscription: true,
      graphiql: false,
      ide: false,
      ...opts,
    })
    .register(import("mercurius-auth"), {
      authContext(context) {
        return {
          identity: context.reply.request.headers["x-user"],
        };
      },
      async applyPolicy(authDirectiveAST, parent, args, context, info) {
        return context.auth?.identity === "admin";
      },
      authDirective: "auth",
    })
    .register(import("mercurius-upload"));
});
