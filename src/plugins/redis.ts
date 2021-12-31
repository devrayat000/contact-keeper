import fp from "fastify-plugin";
import redis, { FastifyRedisPluginOptions } from "fastify-redis";
// import * as Redis from "ioredis";
/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyRedisPluginOptions>(async (fastify, opts) => {
  // const client = new Redis({
  //   host: "localhost",
  //   port: 6379,
  //   lazyConnect: true,
  // });

  void (await fastify.register(redis, {
    host: "localhost",
    port: 6379,
    lazyConnect: true,
  }));
});
