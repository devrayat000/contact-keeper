import fp from "fastify-plugin";
import auth, { FastifyAuthFunction } from "@fastify/auth";

export default fp(async (fastify, opts) => {
  void fastify
    .decorate("verifyJWTandLevel", verifyJWTandLevel)
    .decorate("verifyRefreshToken", verifyRefreshToken)
    .decorate("verifyUserAndPassword", verifyUserAndPassword);

  void (await fastify.register(auth));
});

declare module "fastify" {
  interface FastifyInstance {
    verifyJWTandLevel: FastifyAuthFunction;
    verifyUserAndPassword: FastifyAuthFunction;
    verifyRefreshToken: FastifyAuthFunction;
  }
}

const verifyRefreshToken: FastifyAuthFunction = async function (
  request,
  reply
) {
  await request.refreshTokenVerifyAsync();
};

const verifyJWTandLevel: FastifyAuthFunction = async function (request, reply) {
  // try {
  // request.accessTokenVerify(err => {
  //   if (err) {
  //     return next(err);
  //   }
  //   console.log(request.user);
  //   next();
  // });
  await request.accessTokenVerifyAsync();

  // request.user = (this.jwt as any).accessToken.verify(
  //   request.cookies["x-access-token"]
  // );
  // console.log(request.user);

  // } catch (err) {
  //   this.log.info(err);
  // }
  // const payload = await request.jwtDecode();
  // console.log((payload as any).exp, Date.now());

  // if ((payload as any).exp > Date.now() / 1000) {
  //   throw new Error("Access token expired!");
  // }
  // request.user = payload as any;

  // const accessToken = request.token()!;

  // const tokensStr = await this.redis.get(request.user._id);

  // if (tokensStr) {
  //   const tokens = JSON.parse(tokensStr);
  //   const isBlackListed = (tokens.access as string[]).includes(accessToken);
  //   if (isBlackListed) {
  //     throw new Error("Access token is blacklisted");
  //   }
  // }
};

const verifyUserAndPassword: FastifyAuthFunction = async function (req, res) {
  const { email, password } = req.body as any;
  const user = await this.prisma.user.findFirst({ where: { email } });
  if (!user) {
    throw Error("User not found!");
  }
  const passMatch = await this.bcrypt.compare(password, user.hash);
  if (!passMatch) {
    throw Error("Incorrect Password");
  }

  req.user = { ...user, _id: user.id };
};
