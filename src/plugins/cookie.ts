import fp from "fastify-plugin";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-cookie
 */
export default fp<FastifyCookieOptions>(async (fastify, opts) => {
  await fastify.register(cookie, {
    secret: "cookie-secret",
  });

  void fastify.decorateReply(
    "setTokenCookie",
    function ({ accessToken, refreshToken }: Tokens) {
      const cookieOpts = {
        httpOnly: true,
        signed: process.env.NODE_ENV === "production",
      };
      this.setCookie("x-access-token", accessToken, cookieOpts).setCookie(
        "x-refresh-token",
        refreshToken,
        cookieOpts
      );
    }
  );

  void fastify.decorateReply("clearTokenCookie", function () {
    this.clearCookie("x-access-token").clearCookie("x-refresh-token");
  });
});

declare module "fastify" {
  interface FastifyReply {
    setTokenCookie(this: this, token: Tokens): void;
    clearTokenCookie(this: this): void;
  }
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}
