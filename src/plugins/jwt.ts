import fp from "fastify-plugin";
import jwt, {
  FastifyJWTOptions,
  FastifyJwtVerifyOptions,
  VerifyPayloadType,
} from "fastify-jwt";
import { FastifyRequest } from "fastify";

export default fp<FastifyJWTOptions>(async (fastify, opts) => {
  await fastify.register(jwt, {
    namespace: "accessToken",
    secret: "cat-secret",
    cookie: {
      cookieName: "x-access-token",
      signed: fastify.config.NODE_ENV === "production",
    },
    jwtDecode: "accessTokenDecode",
    jwtVerify: "accessTokenVerify",
    jwtSign: "accessTokenSign",
    verify: {
      algorithms: ["HS256"],
      ignoreExpiration: undefined,
      extractToken: request => request.cookies["x-access-token"],
      // clockTimestamp: Date.now(),
    },
    messages: {
      noAuthorizationInCookieMessage: "You are not loggedin!",
      noAuthorizationInHeaderMessage: "You are not loggedin!",
    },
  });

  await fastify.register(jwt, {
    namespace: "refreshToken",
    secret: "hat-secret",
    cookie: {
      cookieName: "x-refresh-token",
      signed: fastify.config.NODE_ENV === "production",
    },
    jwtDecode: "refreshTokenDecode",
    jwtVerify: "refreshTokenVerify",
    jwtSign: "refreshTokenSign",
    verify: {
      algorithms: ["HS256"],
      ignoreExpiration: undefined,
      extractToken: request => request.cookies["x-refresh-token"],
      clockTimestamp: Date.now(),
      clockTolerance: Date.now() + 1 * 60 * 1000,
    },
    // jwtVerify: "jwtVerify",
  });

  fastify
    .decorateRequest("accessToken", function _token(this: FastifyRequest) {
      return this.cookies["x-access-token"];
    })
    .decorateRequest("refreshToken", function _token(this: FastifyRequest) {
      return this.cookies["x-refresh-token"];
    })
    .decorateRequest(
      "accessTokenVerifyAsync",
      function (this: FastifyRequest, options?: FastifyJwtVerifyOptions) {
        return new Promise<VerifyPayloadType>((resolve, reject) => {
          options
            ? this.accessTokenVerify(options, callback)
            : this.accessTokenVerify(callback);

          function callback(err: Error | null, payload: any) {
            err ? reject(err) : resolve(payload);
          }
        });
      }
    )
    .decorateRequest(
      "refreshTokenVerifyAsync",
      function (this: FastifyRequest, options?: FastifyJwtVerifyOptions) {
        return new Promise<VerifyPayloadType>((resolve, reject) => {
          options
            ? this.refreshTokenVerify(options, callback)
            : this.refreshTokenVerify(callback);

          function callback(err: Error | null, payload: any) {
            err ? reject(err) : resolve(payload);
          }
        });
      }
    );
});

declare module "fastify" {
  interface FastifyRequest {
    accessToken(): string | undefined;
    refreshToken(): string | undefined;
    accessTokenDecode: this["jwtDecode"];
    accessTokenVerify: this["jwtVerify"];
    refreshTokenDecode: this["jwtDecode"];
    refreshTokenVerify: this["jwtVerify"];
    accessTokenVerifyAsync(): Promise<VerifyPayloadType>;
    accessTokenVerifyAsync(
      options?: FastifyJwtVerifyOptions
    ): Promise<VerifyPayloadType>;
    refreshTokenVerifyAsync(): Promise<VerifyPayloadType>;
    refreshTokenVerifyAsync(
      options?: FastifyJwtVerifyOptions
    ): Promise<VerifyPayloadType>;
  }

  interface FastifyReply {
    accessTokenSign: this["jwtSign"];
    refreshTokenSign: this["jwtSign"];
  }
}

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: {
      _id: string;
      email?: string;
      name?: string;
    };
    // user: { _id: string; email: string; name: string };
  }
}
