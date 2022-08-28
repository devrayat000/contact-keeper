// import {Worker} from 'worker_threads'
import type { FastifyPluginAsync } from "fastify";
import type { RouteGenericInterface } from "fastify/types/route";
import { UserTable } from "knex/types/tables";
import { Schema } from "../../../../src/types/schema";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", {
    schema: {
      response: {
        200: userReplySchema,
      },
    },
    preHandler: fastify.auth([fastify.verifyJWTandLevel]),
    // preValidation: [fastify.verifyJWTandLevel],
    // },
    handler: async function (request, reply) {
      const [user] = await this.knex("user")
        .where({ _id: request.user._id })
        .limit(1);

      reply.statusCode = 200;
      return { user };
    },
  });

  fastify.post<ILogin>(
    "/login",
    {
      schema: {
        body: loginBodySchema,
        response: {
          200: userReplySchema,
        },
      },
      preHandler: fastify.auth([fastify.verifyUserAndPassword]),
    },
    async function (request, reply) {
      const [user] = await this.knex("user")
        .where({ _id: request.user._id })
        .limit(0);

      const accessToken = await reply.accessTokenSign(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        { expiresIn: "15m" }
      );
      // console.log(accessToken);

      const refreshToken = await reply.refreshTokenSign(
        { _id: user._id },
        { expiresIn: "15d" }
      );
      reply.setTokenCookie({ accessToken, refreshToken });

      reply.statusCode = 200;
      return { user: user };
    }
  );

  fastify.post<IRegister>(
    "/register",
    {
      schema: {
        body: registerBodySchema,
        response: {
          201: userReplySchema,
        },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body;
      const { hash, salt } = await request.bcryptHash(password);
      const users = await fastify
        .knex("user")
        .insert({ email, name, hash, salt })
        .returning("*")!;

      const { hash: storedHash, salt: storedSalt, ...user } = users[0];

      const accessToken = await reply.accessTokenSign(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        { expiresIn: "15m" }
      );
      const refreshToken = await reply.refreshTokenSign(
        {
          _id: user._id,
        },
        { expiresIn: "15d" }
      );

      reply.setTokenCookie({ accessToken, refreshToken });

      reply.statusCode = 201;
      return { user };
    }
  );

  fastify.post(
    "/logout",
    { preHandler: fastify.auth([fastify.verifyJWTandLevel]) },
    async (request, reply) => {
      // let tokenStr = await fastify.redis.get(request.user._id);
      // let tokens = {
      //   access: [] as string[],
      //   refresh: [] as string[],
      // };
      // if (tokenStr) {
      //   tokens = JSON.parse(tokenStr);
      // }
      // tokens.access.push(request.accessToken()!);
      // await fastify.redis.set(request.user._id, JSON.stringify(tokens));
      reply.clearTokenCookie();

      return {
        message: "Successfully logged out!",
      };
    }
  );

  fastify.get(
    "/refresh",
    {
      schema: {
        response: {
          200: userReplySchema,
        },
      },
      preHandler: fastify.auth([fastify.verifyRefreshToken]),
    },
    async function (request, reply) {
      const [user] = await this.knex("user")
        .where({ _id: request.user._id })
        .limit(0);

      const accessToken = await reply.jwtSign(
        {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        { expiresIn: "1h" }
      );
      const refreshToken = await reply.jwtSign(
        { _id: user._id },
        { expiresIn: "1h" }
      );
      reply.setTokenCookie({ accessToken, refreshToken });

      reply.statusCode = 200;
      return { user };
    }
  );
};

interface ILogin extends RouteGenericInterface {
  Body: {
    email: string;
    password: string;
  };
  Reply: {
    user: Omit<UserTable, "hash" | "salt">;
  };
}

interface IRegister extends ILogin {
  Body: {
    name: string;
    email: string;
    password: string;
  };
}

export default root;

const loginBodySchema: Schema<ILogin["Body"]> = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
};

const registerBodySchema: Schema<IRegister["Body"]> = {
  type: "object",
  properties: {
    name: { type: "string" },
    ...loginBodySchema.properties,
  },
  required: ["email", "name", "password"],
};

const userReplySchema: Schema<{ user: Omit<UserTable, "hash" | "salt"> }> = {
  type: "object",
  properties: {
    user: {
      type: "object",
      properties: {
        _id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
      },
    },
  },
};
