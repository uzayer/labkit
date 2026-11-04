import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Schema batch from the lab-website research pass. Everything is additive:
// - new select options (Team roles, Publication types, Grant currencies and the
//   `supported` investigator role, Organization types, Review Item kind,
//   provenance `datacite`) need no SQL, because a select is a plain text column;
// - new columns: team.alumni_role, team.start_year, publications.version_of_id;
// - a new table: publications_links;
// - the Features global's column defaults for grants/awards flip to false.
//
// Hand edits to the generated SQL, and why:
// - `features` is rebuilt to change its defaults. Nothing references it and it
//   has no child tables, so the DROP can't cascade anywhere; its row is copied
//   column for column, so DIAL's saved switches are unchanged.
// - The generated ADD COLUMN for version_of_id lost the FK's ON DELETE SET NULL
//   (the snapshot has it). Without it, deleting a published Publication that a
//   preprint points at would fail on the foreign key.
// - The generated down() rebuilt `publications` to drop version_of_id. DROP
//   TABLE publications cascades into publications_authors/_texts/_rels and
//   every *_rels row pointing at a Publication, and PRAGMA foreign_keys=OFF
//   doesn't reliably stop that on Turso (see 20261104_145319). SQLite ≥ 3.35
//   can DROP COLUMN once the column's index is gone, so down() does that instead.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`publications_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`type\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`publications_links_order_idx\` ON \`publications_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_links_parent_id_idx\` ON \`publications_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_features\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`projects\` integer DEFAULT true,
  	\`grants\` integer DEFAULT false,
  	\`awards\` integer DEFAULT false,
  	\`news_items\` integer DEFAULT true,
  	\`research_themes\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_features\`("id", "projects", "grants", "awards", "news_items", "research_themes", "updated_at", "created_at") SELECT "id", "projects", "grants", "awards", "news_items", "research_themes", "updated_at", "created_at" FROM \`features\`;`,
  )
  await db.run(sql`DROP TABLE \`features\`;`)
  await db.run(sql`ALTER TABLE \`__new_features\` RENAME TO \`features\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`ALTER TABLE \`publications\` ADD \`version_of_id\` text(36) REFERENCES publications(id) ON UPDATE no action ON DELETE set null;`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_version_of_idx\` ON \`publications\` (\`version_of_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`team\` ADD \`alumni_role\` text;`)
  await db.run(sql`ALTER TABLE \`team\` ADD \`start_year\` numeric;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`publications_links\`;`)
  await db.run(sql`DROP INDEX \`publications_version_of_idx\`;`)
  await db.run(sql`ALTER TABLE \`publications\` DROP COLUMN \`version_of_id\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_features\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`projects\` integer DEFAULT true,
  	\`grants\` integer DEFAULT true,
  	\`awards\` integer DEFAULT true,
  	\`news_items\` integer DEFAULT true,
  	\`research_themes\` integer DEFAULT true,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_features\`("id", "projects", "grants", "awards", "news_items", "research_themes", "updated_at", "created_at") SELECT "id", "projects", "grants", "awards", "news_items", "research_themes", "updated_at", "created_at" FROM \`features\`;`,
  )
  await db.run(sql`DROP TABLE \`features\`;`)
  await db.run(sql`ALTER TABLE \`__new_features\` RENAME TO \`features\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`ALTER TABLE \`team\` DROP COLUMN \`alumni_role\`;`)
  await db.run(sql`ALTER TABLE \`team\` DROP COLUMN \`start_year\`;`)
}
