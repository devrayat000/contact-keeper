import { objectType, queryField, list } from "nexus";
import { Contact } from "nexus-prisma";

export const contactType = objectType({
  name: Contact.$name,
  description: Contact.$description,
  definition(t) {
    t.field(Contact.id);
    t.field(Contact.name);
    t.field(Contact.createdAt);
    t.field(Contact.updatedAt);
  },
});

export const contactQuery = queryField("contacts", {
  type: list(contactType),
  resolve(_, __, ctx) {
    return ctx.prisma.contact.findMany();
  },
});
