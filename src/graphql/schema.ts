import * as path from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import {
  objectType,
  enumType,
  queryField,
  list,
  nonNull,
  inputObjectType,
  arg,
  mutationField,
  scalarType,
  nullable,
} from "nexus";
import {
  Contact,
  PhoneInfo,
  ContactType,
  EmailInfo,
  User,
  Role,
} from "nexus-prisma";
import { connectionFromArray } from "graphql-relay";
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";

export const Upload = scalarType({
  name: GraphQLUpload.name,
  asNexusMethod: "upload",
  description: GraphQLUpload.description,
  extensions: GraphQLUpload.extensions,
  parseLiteral: GraphQLUpload.parseLiteral,
  parseValue: GraphQLUpload.parseValue,
  serialize: GraphQLUpload.serialize,
  sourceType: {
    export: "UploadType",
    module: path.resolve("src/types/graphql-upload.d.ts"),
  },
});

export const contactTypeEnum = enumType({
  name: ContactType.name,
  description: ContactType.description,
  members: ContactType.members,
});

export const roleEnum = enumType({
  name: Role.name,
  description: Role.description,
  members: Role.members,
});

export const contactType = objectType({
  name: Contact.$name,
  description: Contact.$description,
  definition(t) {
    t.field(Contact.id);
    t.field(Contact.name);
    t.field(Contact.phones);
    t.field(Contact.emails);
    t.field(Contact.user);
    t.field(Contact.createdAt);
    t.field(Contact.updatedAt);
  },
});

export const userType = objectType({
  name: User.$name,
  description: User.$description,
  definition(t) {
    t.field(User.id);
    t.field(User.name);
    t.field(User.email);
    t.connectionField(User.contacts.name, {
      type: contactType,
      resolve: async (src, args, ctx) => {
        const contacts = await ctx.prisma.contact.findMany({
          where: {
            userId: src.id,
          },
          take: args.first ?? -(args.last ?? 0) ?? undefined,
        });
        return connectionFromArray(contacts, args);
      },
    });
    t.field(User.role);
    t.field(User.imageUrl);
    t.field(User.imageMime);
    t.field(User.createdAt);
    t.field(User.updatedAt);
  },
});

export const phoneInfoType = objectType({
  name: PhoneInfo.$name,
  description: PhoneInfo.$description,
  definition(t) {
    t.field(PhoneInfo.id);
    t.field(PhoneInfo.value);
    t.field(PhoneInfo.type);
    t.field(PhoneInfo.contact);
  },
});

export const emailInfoType = objectType({
  name: EmailInfo.$name,
  description: EmailInfo.$description,
  definition(t) {
    t.field(EmailInfo.id);
    t.field(EmailInfo.value);
    t.field(EmailInfo.type);
    t.field(EmailInfo.contact);
  },
});

export const contactQuery = queryField("contacts", {
  type: nonNull(list(nonNull(contactType))),
  resolve(_, __, ctx) {
    return ctx.prisma.contact.findMany();
  },
});

// export const profileQuery = queryField("me", {
//   type: nullable(userType),
//   async resolve(src, args, ctx) {
//     return await ctx.prisma.user.findUnique({
//       where: { email: "rayat@admin.com" },
//     });
//   },
// });

export const registerInputType = inputObjectType({
  name: "RegisterInput",
  definition(t) {
    t.field(User.name);
    t.field(User.email);
    t.field(User.hash);
    t.field(User.salt);
    t.field("image", {
      type: Upload,
    });
  },
});

const uploadsDir = "public/upload";

export const userRegisterMutation = mutationField("register", {
  type: userType,
  args: {
    input: nonNull(
      arg({
        type: registerInputType,
      })
    ),
  },
  async resolve(src, { input }, ctx) {
    let imageUrl: string | null = null,
      imageMime: string | null = null;

    if (input.image) {
      const { filename, mimetype, createReadStream } = await input.image;
      const rs = createReadStream();
      const ws = createWriteStream(path.join(uploadsDir, filename));
      await pipeline(rs, ws);
      imageUrl = "upload/" + filename;
      imageMime = mimetype;
    }
    return {
      id: "123x",
      email: input.email,
      name: input.name,
      role: "USER",
      imageUrl,
      imageMime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
});
