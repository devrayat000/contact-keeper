import fp from "fastify-plugin";
import _knex, { Knex } from "knex";
import knexTinyLogger from "knex-tiny-logger";

import knexConfig from "../../knexfile";

export default fp<Knex.Config>(async (fastify, opts) => {
  const env = fastify.config.NODE_ENV ?? "development";
  const knex = _knex({ ...knexConfig[env], ...opts });

  void fastify.decorate("knex", knexTinyLogger(knex));
});

declare module "fastify" {
  export interface FastifyInstance {
    knex: Knex;
  }
}

declare module "knex/types/tables" {
  interface _Base {
    _id: string;
    created_at: string;
  }

  interface UserTableUpdate {
    name?: string;
    hash?: string;
    salt?: string;
  }

  interface UserTableInsert extends Required<UserTableUpdate> {
    email: string;
  }
  interface UserTable extends UserTableInsert, _Base {
    updated_at: string;
  }

  export enum ContactType {
    MOBILE = "mobile",
    HOME = "home",
    WORK = "work",
    OTHER = "other",
  }

  interface ContactTableUpdate {
    name?: string;
    email?: string;
    phone?: string;
    type?: ContactType;
  }

  interface ContactTableInsert extends Required<ContactTableUpdate> {
    user: string;
  }

  interface ContactTable extends ContactTableInsert, _Base {}

  interface Tables {
    user: Knex.CompositeTableType<UserTable, UserTableInsert, UserTableUpdate>;
    contact: Knex.CompositeTableType<
      ContactTable,
      ContactTableInsert,
      ContactTableUpdate
    >;
  }
}
