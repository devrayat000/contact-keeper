import fp from "fastify-plugin";
import processRequest from "graphql-upload/processRequest.js";
import { type MercuriusOptions } from "mercurius";
import {
  makeSchema,
  fieldAuthorizePlugin,
  connectionPlugin,
  queryComplexityPlugin,
} from "nexus";
import Scalars from "nexus-prisma/scalars";

import * as types from "../graphql/schema";
import { createContext } from "../utils/gql-context";

const schema = makeSchema({
  types: [Scalars, types],
  outputs: {
    schema: __dirname + "/../../schema.graphql",
    typegen: __dirname + "/../../src/graphql/generated/nexus.d.ts",
  },
  contextType: {
    module: __dirname + "/../../src/utils/gql-context.ts",
    export: "Context",
  },
  plugins: [
    fieldAuthorizePlugin(),
    connectionPlugin(),
    queryComplexityPlugin(),
  ],
});

export default fp<MercuriusOptions>(async (fastify, opts) => {
  await fastify
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
    })
    .register(import("mercurius-auth"), {
      authContext(context) {
        return {
          identity: context.reply.request.headers["x-user"],
        };
      },
      async applyPolicy(authDirectiveAST, parent, args, context, info) {
        console.log(context.auth);

        return context.auth?.identity === "admin";
      },
      authDirective: "auth",
    });
  // .register(import("@fastify/multipart"), {
  //   addToBody: true,
  //   attachFieldsToBody: "keyValues",
  //   onFile: (filename: any) => {
  //     console.log(filename);
  //   },
  // })
  // .addHook("preValidation", async (request, reply) => {
  //   if (!request.isMultipart()) {
  //     return;
  //   }
  //   console.log("here");
  //   // const a = await request.file();
  //   request.body = await processRequest(request.raw, reply.raw, {
  //     maxFiles: 1,
  //     maxFieldSize: 5 * 1024 ** 2,
  //   });
  // });
  // .register(import("mercurius-upload"));
});
