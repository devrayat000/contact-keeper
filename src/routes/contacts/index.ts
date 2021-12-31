import type { FastifyPluginAsync } from "fastify";
import type { RouteGenericInterface } from "fastify/types/route";
import type {
  ContactTable,
  ContactTableInsert,
  ContactTableUpdate,
} from "knex/types/tables";
import type { Schema } from "../../types/schema";

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<IContact>(
    "/",
    {
      schema: {
        response: {
          200: contactsReplySchema,
        },
      },
      preHandler: fastify.auth([fastify.verifyJWTandLevel]),
    },
    async (requset, reply) => {
      const contacts = await fastify
        .knex("contact")
        .where({ user: requset.user._id })
        .orderBy("created_at", "desc");

      return { contacts };
    }
  );

  fastify.post<IContactCreate>(
    "/",
    {
      schema: {
        body: createContactBody,
        response: {
          201: createContactReply,
        },
      },
      preHandler: fastify.auth([fastify.verifyJWTandLevel]),
    },
    async function (request, reply) {
      const [contact] = await this.knex("contact")
        .insert({
          ...request.body,
          user: request.user._id,
        })
        .returning("*");

      reply.statusCode = 201;
      return { contact };
    }
  );

  fastify.patch<IContactUpdate>(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          ...createContactBody,
          required: [],
        },
        response: {
          200: createContactReply,
        },
      },
      preHandler: fastify.auth([fastify.verifyJWTandLevel]),
    },
    async function (request, reply) {
      const [contact] = await this.knex("contact")
        .update({ ...request.body })
        .where({ user: request.user._id, _id: request.params.id })
        .returning("*");

      return { contact };
    }
  );

  fastify.delete<IContactDelete>(
    "/:id",
    {
      preHandler: fastify.auth([fastify.verifyJWTandLevel]),
    },
    async function (request, reply) {
      const [contact] = await this.knex("contact")
        .delete()
        .where({ user: request.user._id, _id: request.params.id })
        .returning("*");

      return { message: `Contact name ${contact.name} removed` };
    }
  );
};

interface IContactDelete extends RouteGenericInterface {
  Params: {
    id: string;
  };
  Reply: {
    message: string;
  };
}

interface IContactUpdate extends Omit<IContactDelete, "Reply"> {
  Body: ContactTableUpdate;
  Reply: {
    contact: ContactTable;
  };
}

interface IContact extends RouteGenericInterface {
  Reply: {
    contacts: ContactTable[];
  };
}

interface IContactCreate extends RouteGenericInterface {
  Body: Omit<ContactTableInsert, "user">;
  Reply: {
    contact: ContactTable;
  };
}

const createContactReply: Schema<IContactCreate["Reply"]> = {
  type: "object",
  properties: {
    contact: {
      type: "object",
      properties: {
        _id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        phone: { type: "string" },
        user: { type: "string" },
        created_at: { type: "string" },
        type: {
          type: "string",
          enum: ["home", "mobile", "other", "work"],
        },
      },
    },
  },
};

const contactsReplySchema: Schema<IContact["Reply"]> = {
  type: "object",
  properties: {
    contacts: {
      type: "array",
      items: createContactReply.properties.contact,
    },
  },
  required: ["contacts"],
};

const createContactBody: Schema<IContactCreate["Body"]> = {
  type: "object",
  properties: {
    email: { type: "string" },
    name: { type: "string" },
    phone: { type: "string" },
    type: {
      type: "string",
      enum: ["home", "mobile", "other", "work"],
    },
  },
  required: ["email", "name", "phone", "type"],
};

export default root;
