import fp from "fastify-plugin";
// import bcrypt from "fastify-bcrypt";
import * as bcrypt from "bcrypt";

export default fp(async (fastify, opts) => {
  void fastify
    .decorate("bcrypt", {
      hash: hashPassword,
      compare: comparePassword,
    })
    .decorateRequest("bcryptHash", hashPassword)
    .decorateRequest("bcryptCompare", comparePassword);
});

async function hashPassword(password: string, saltFactor: number = 10) {
  const salt = await bcrypt.genSalt(saltFactor);
  const hash = await bcrypt.hash(password, salt);

  return {
    salt,
    hash,
  };
}

async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

declare module "fastify" {
  interface FastifyInstance {
    bcrypt: {
      hash: typeof hashPassword;
      compare: typeof comparePassword;
    };
  }

  interface FastifyRequest {
    bcryptHash: typeof hashPassword;
    bcryptCompare: typeof comparePassword;
  }
}
