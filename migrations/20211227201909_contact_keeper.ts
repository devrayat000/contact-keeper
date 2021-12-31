import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const _id = knex.raw("gen_random_uuid()");

  await knex.schema.createTable("user", table => {
    table.uuid("_id").primary().defaultTo(_id);
    table.string("name", 128).notNullable();
    table.string("email", 128).unique().notNullable();
    table.string("hash", 255).notNullable();
    table.string("salt", 255).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("contact", table => {
    table.uuid("_id").primary().defaultTo(_id);
    table.uuid("user").notNullable();
    table.string("name", 128).notNullable();
    table.string("email", 128).unique().notNullable();
    table.string("phone", 128).unique().notNullable();
    table
      .enum("type", ["mobile", "home", "work", "other"], {
        enumName: "contact_type",
        useNative: true,
      })
      .defaultTo("mobile");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("contact", table => {
    table
      .foreign("user", "contact_user_foreign")
      .references("_id")
      .inTable("user")
      .onDelete("CASCADE");

    table.index("user", "contact_user_index");
    table.index("name", "contact_name_index");
    table.index("email", "contact_email_index");
    table.index("phone", "contact_phone_index");
  });

  await knex.schema.alterTable("user", table => {
    table.index("_id", "user_id_index");
    table.index("email", "user_email_index");
    table.index("name", "user_name_index");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(/*sql*/ `
        DROP TABLE IF EXISTS "user", "contact" CASCADE;
    `);
}
