// Update with your config settings.

import { Knex } from "knex";

const knexConfig: KnexConfig = {
  development: {
    client: "pg",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "ppooii12",
      port: 5066,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
  },

  test: {
    client: "pg",
    connection: {
      database: "test",
      user: "postgres",
      password: "ppooii12",
      port: 5066,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      database: "contact-keeper",
      user: "postgres",
      password: "ppooii12",
      port: 5066,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      tableName: "contact_keeper_migrations",
    },
  },
};

export default knexConfig;

export type KnexConfig = Record<
  "development" | "test" | "production",
  Knex.Config
>;
