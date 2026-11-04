import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

// Roadmap step 4: the Features global, Lab content fields on LabInfo and
// ResearchThemes, and LabInfo without DIAL's column defaults or its old
// `features_*` columns, whose values move to the Features global. No new
// content is written here; `scripts/seed-dial-content.ts` seeds DIAL's separately.
//
// Dropping the defaults means rebuilding lab_info, and DROP TABLE cascades into
// lab_info_socials and lab_info_rels wherever foreign keys are enforced.
// `PRAGMA foreign_keys=OFF` can't be relied on to stop that: it is a no-op inside
// a transaction and doesn't carry between statements over a remote libsql
// client (Turso). So the child rows are copied aside first, and any the drop
// removed are put back by primary key afterwards.
//
// The generated INSERT…SELECT also listed the new columns (headline, intro, …)
// on the SELECT side, where SQLite would read the missing quoted names as string
// literals. Only columns both tables share are copied.

type DB = MigrateUpArgs['db']

async function saveLabInfoChildren(db: DB) {
  await db.run(sql`DROP TABLE IF EXISTS \`__keep_lab_info_socials\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`__keep_lab_info_rels\`;`)
  await db.run(sql`CREATE TABLE \`__keep_lab_info_socials\` AS SELECT * FROM \`lab_info_socials\`;`)
  await db.run(sql`CREATE TABLE \`__keep_lab_info_rels\` AS SELECT * FROM \`lab_info_rels\`;`)
}

async function restoreLabInfoChildren(db: DB) {
  await db.run(
    sql`INSERT OR IGNORE INTO \`lab_info_socials\` ("_order", "_parent_id", "id", "platform", "url") SELECT "_order", "_parent_id", "id", "platform", "url" FROM \`__keep_lab_info_socials\`;`,
  )
  await db.run(
    sql`INSERT OR IGNORE INTO \`lab_info_rels\` ("id", "order", "parent_id", "path", "organizations_id") SELECT "id", "order", "parent_id", "path", "organizations_id" FROM \`__keep_lab_info_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`__keep_lab_info_socials\`;`)
  await db.run(sql`DROP TABLE \`__keep_lab_info_rels\`;`)
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`features\` (
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
  // Carry any toggles saved on LabInfo's old features group over to the global.
  // News Items had no toggle, so it starts on.
  await db.run(
    sql`INSERT INTO \`features\` ("id", "projects", "grants", "awards", "news_items", "research_themes", "updated_at", "created_at") SELECT "id", "features_projects", "features_grants", "features_awards", true, "features_research_themes", "updated_at", "created_at" FROM \`lab_info\`;`,
  )
  await saveLabInfoChildren(db)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_lab_info\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`short_name\` text,
  	\`description\` text,
  	\`headline\` text,
  	\`intro\` text,
  	\`about\` text,
  	\`parent_organization_name\` text,
  	\`parent_organization_url\` text,
  	\`parent_organization_department\` text,
  	\`email\` text,
  	\`url\` text,
  	\`logo_id\` text(36),
  	\`location_address\` text,
  	\`location_city\` text,
  	\`location_country\` text,
  	\`identifiers_ror_id\` text,
  	\`identifiers_wikidata_id\` text,
  	\`identifiers_openalex_id\` text,
  	\`founding_date\` text,
  	\`recruitment_opens\` text,
  	\`recruitment_closes\` text,
  	\`join_us\` text,
  	\`onboarding_completed\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_lab_info\`("id", "name", "short_name", "description", "parent_organization_name", "parent_organization_url", "parent_organization_department", "email", "url", "logo_id", "location_address", "location_city", "location_country", "identifiers_ror_id", "identifiers_wikidata_id", "identifiers_openalex_id", "founding_date", "recruitment_opens", "recruitment_closes", "onboarding_completed", "updated_at", "created_at") SELECT "id", "name", "short_name", "description", "parent_organization_name", "parent_organization_url", "parent_organization_department", "email", "url", "logo_id", "location_address", "location_city", "location_country", "identifiers_ror_id", "identifiers_wikidata_id", "identifiers_openalex_id", "founding_date", "recruitment_opens", "recruitment_closes", "onboarding_completed", "updated_at", "created_at" FROM \`lab_info\`;`,
  )
  await db.run(sql`DROP TABLE \`lab_info\`;`)
  await db.run(sql`ALTER TABLE \`__new_lab_info\` RENAME TO \`lab_info\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`lab_info_logo_idx\` ON \`lab_info\` (\`logo_id\`);`)
  await restoreLabInfoChildren(db)
  await db.run(sql`ALTER TABLE \`research_themes\` ADD \`body\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await saveLabInfoChildren(db)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_lab_info\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text DEFAULT 'DIAL Lab' NOT NULL,
  	\`short_name\` text DEFAULT 'DIAL',
  	\`description\` text,
  	\`parent_organization_name\` text DEFAULT 'North South University',
  	\`parent_organization_url\` text,
  	\`parent_organization_department\` text,
  	\`email\` text,
  	\`url\` text,
  	\`logo_id\` text(36),
  	\`location_address\` text,
  	\`location_city\` text DEFAULT 'Dhaka',
  	\`location_country\` text DEFAULT 'Bangladesh',
  	\`identifiers_ror_id\` text,
  	\`identifiers_wikidata_id\` text,
  	\`identifiers_openalex_id\` text,
  	\`founding_date\` text,
  	\`recruitment_opens\` text,
  	\`recruitment_closes\` text,
  	\`features_projects\` integer DEFAULT true,
  	\`features_grants\` integer DEFAULT true,
  	\`features_awards\` integer DEFAULT true,
  	\`features_research_themes\` integer DEFAULT true,
  	\`onboarding_completed\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_lab_info\`("id", "name", "short_name", "description", "parent_organization_name", "parent_organization_url", "parent_organization_department", "email", "url", "logo_id", "location_address", "location_city", "location_country", "identifiers_ror_id", "identifiers_wikidata_id", "identifiers_openalex_id", "founding_date", "recruitment_opens", "recruitment_closes", "onboarding_completed", "updated_at", "created_at") SELECT "id", "name", "short_name", "description", "parent_organization_name", "parent_organization_url", "parent_organization_department", "email", "url", "logo_id", "location_address", "location_city", "location_country", "identifiers_ror_id", "identifiers_wikidata_id", "identifiers_openalex_id", "founding_date", "recruitment_opens", "recruitment_closes", "onboarding_completed", "updated_at", "created_at" FROM \`lab_info\`;`,
  )
  await db.run(sql`DROP TABLE \`lab_info\`;`)
  await db.run(sql`ALTER TABLE \`__new_lab_info\` RENAME TO \`lab_info\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`lab_info_logo_idx\` ON \`lab_info\` (\`logo_id\`);`)
  await restoreLabInfoChildren(db)
  await db.run(sql`ALTER TABLE \`research_themes\` DROP COLUMN \`body\`;`)
  await db.run(
    sql`UPDATE \`lab_info\` SET "features_projects" = f."projects", "features_grants" = f."grants", "features_awards" = f."awards", "features_research_themes" = f."research_themes" FROM (SELECT * FROM \`features\` LIMIT 1) AS f;`,
  )
  await db.run(sql`DROP TABLE \`features\`;`)
}
