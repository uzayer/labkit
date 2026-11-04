import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`publications_authors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`team_member_id\` text(36),
  	\`custom_author_name\` text,
  	\`custom_author_orcid\` text,
  	\`custom_author_dblp_pid\` text,
  	\`custom_author_affiliation_id\` text(36),
  	\`custom_author_affiliation_label\` text,
  	\`author_position\` numeric,
  	\`is_co_first\` integer DEFAULT false,
  	\`is_corresponding\` integer DEFAULT false,
  	FOREIGN KEY (\`team_member_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`custom_author_affiliation_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`publications_authors_order_idx\` ON \`publications_authors\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_authors_parent_id_idx\` ON \`publications_authors\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_authors_team_member_idx\` ON \`publications_authors\` (\`team_member_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_authors_custom_author_custom_author_affilia_idx\` ON \`publications_authors\` (\`custom_author_affiliation_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`publications\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`doi\` text,
  	\`bibtex\` text,
  	\`title\` text NOT NULL,
  	\`year\` numeric NOT NULL,
  	\`abstract\` text,
  	\`status\` text DEFAULT 'published' NOT NULL,
  	\`type\` text,
  	\`publication_date\` text,
  	\`acceptance_date\` text,
  	\`venue_id\` text(36),
  	\`venue_label\` text,
  	\`location\` text,
  	\`volume\` text,
  	\`issue\` text,
  	\`page_start\` text,
  	\`page_end\` text,
  	\`publisher\` text,
  	\`series\` text,
  	\`editor\` text,
  	\`citation_text\` text,
  	\`external_url\` text,
  	\`is_open_access\` integer DEFAULT false,
  	\`license\` text,
  	\`pdf_type\` text DEFAULT 'upload',
  	\`pdf_upload_id\` text(36),
  	\`pdf_link\` text,
  	\`display_in_website\` integer DEFAULT true,
  	\`featured\` integer DEFAULT false,
  	\`provenance_source\` text DEFAULT 'manual',
  	\`provenance_imported_at\` text,
  	\`provenance_source_note\` text,
  	\`openalex_id\` text,
  	\`citation_count\` numeric,
  	\`citation_count_updated_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`venue_id\`) REFERENCES \`venues\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`pdf_upload_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`publications_doi_idx\` ON \`publications\` (\`doi\`);`)
  await db.run(sql`CREATE INDEX \`publications_year_idx\` ON \`publications\` (\`year\`);`)
  await db.run(sql`CREATE INDEX \`publications_type_idx\` ON \`publications\` (\`type\`);`)
  await db.run(
    sql`CREATE INDEX \`publications_publication_date_idx\` ON \`publications\` (\`publication_date\`);`,
  )
  await db.run(sql`CREATE INDEX \`publications_venue_idx\` ON \`publications\` (\`venue_id\`);`)
  await db.run(
    sql`CREATE INDEX \`publications_pdf_pdf_upload_idx\` ON \`publications\` (\`pdf_upload_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_display_in_website_idx\` ON \`publications\` (\`display_in_website\`);`,
  )
  await db.run(sql`CREATE INDEX \`publications_featured_idx\` ON \`publications\` (\`featured\`);`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`publications_openalex_id_idx\` ON \`publications\` (\`openalex_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_updated_at_idx\` ON \`publications\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_created_at_idx\` ON \`publications\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`publications_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`publications_texts_order_parent\` ON \`publications_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`publications_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`research_themes_id\` text(36),
  	\`awards_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`research_themes_id\`) REFERENCES \`research_themes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`awards_id\`) REFERENCES \`awards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`publications_rels_order_idx\` ON \`publications_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_rels_parent_idx\` ON \`publications_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_rels_path_idx\` ON \`publications_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_rels_research_themes_id_idx\` ON \`publications_rels\` (\`research_themes_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`publications_rels_awards_id_idx\` ON \`publications_rels\` (\`awards_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`team_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`team_socials_order_idx\` ON \`team_socials\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`team_socials_parent_id_idx\` ON \`team_socials\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`team\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`first_name\` text NOT NULL,
  	\`middle_name\` text,
  	\`last_name\` text NOT NULL,
  	\`name\` text,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`affiliation_id\` text(36),
  	\`affiliation_label\` text,
  	\`photo_id\` text(36),
  	\`bio\` text,
  	\`email\` text,
  	\`orcid\` text,
  	\`openalex_id\` text,
  	\`dblp_pid\` text,
  	\`role\` text NOT NULL,
  	\`display_in_website\` integer DEFAULT true,
  	\`source\` text DEFAULT 'manual',
  	\`emerging\` integer DEFAULT false,
  	\`on_leave\` text,
  	\`alumni_year\` numeric,
  	\`current_position\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`affiliation_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`team_slug_idx\` ON \`team\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`team_affiliation_idx\` ON \`team\` (\`affiliation_id\`);`)
  await db.run(sql`CREATE INDEX \`team_photo_idx\` ON \`team\` (\`photo_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`team_orcid_idx\` ON \`team\` (\`orcid\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`team_openalex_id_idx\` ON \`team\` (\`openalex_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`team_dblp_pid_idx\` ON \`team\` (\`dblp_pid\`);`)
  await db.run(sql`CREATE INDEX \`team_role_idx\` ON \`team\` (\`role\`);`)
  await db.run(
    sql`CREATE INDEX \`team_display_in_website_idx\` ON \`team\` (\`display_in_website\`);`,
  )
  await db.run(sql`CREATE INDEX \`team_source_idx\` ON \`team\` (\`source\`);`)
  await db.run(sql`CREATE INDEX \`team_updated_at_idx\` ON \`team\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`team_created_at_idx\` ON \`team\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`team_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`team_texts_order_parent\` ON \`team_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`date\` text NOT NULL,
  	\`date_precision\` text DEFAULT 'day' NOT NULL,
  	\`type\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`photo_id\` text(36),
  	\`url\` text,
  	\`provenance_source\` text DEFAULT 'manual',
  	\`provenance_imported_at\` text,
  	\`provenance_source_note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`news_slug_idx\` ON \`news\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`news_date_idx\` ON \`news\` (\`date\`);`)
  await db.run(sql`CREATE INDEX \`news_type_idx\` ON \`news\` (\`type\`);`)
  await db.run(sql`CREATE INDEX \`news_photo_idx\` ON \`news\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`projects\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`local_name\` text,
  	\`abstract\` text,
  	\`hero_image_id\` text(36),
  	\`start_date\` text,
  	\`end_date\` text,
  	\`external_url\` text,
  	\`content\` text,
  	\`status\` text DEFAULT 'ongoing',
  	\`featured\` integer DEFAULT false,
  	\`published_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_hero_image_idx\` ON \`projects\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_start_date_idx\` ON \`projects\` (\`start_date\`);`)
  await db.run(sql`CREATE INDEX \`projects_end_date_idx\` ON \`projects\` (\`end_date\`);`)
  await db.run(sql`CREATE INDEX \`projects_status_idx\` ON \`projects\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`projects_featured_idx\` ON \`projects\` (\`featured\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`projects__status_idx\` ON \`projects\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`projects_locales\` (
  	\`meta_title\` text,
  	\`meta_image_id\` text(36),
  	\`meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`projects_meta_meta_image_idx\` ON \`projects_locales\` (\`meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`projects_locales_locale_parent_id_unique\` ON \`projects_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`team_id\` text(36),
  	\`grants_id\` text(36),
  	\`research_themes_id\` text(36),
  	\`publications_id\` text(36),
  	\`awards_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`grants_id\`) REFERENCES \`grants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`research_themes_id\`) REFERENCES \`research_themes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`publications_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`awards_id\`) REFERENCES \`awards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_rels_order_idx\` ON \`projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_parent_idx\` ON \`projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_path_idx\` ON \`projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_team_id_idx\` ON \`projects_rels\` (\`team_id\`);`)
  await db.run(
    sql`CREATE INDEX \`projects_rels_grants_id_idx\` ON \`projects_rels\` (\`grants_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`projects_rels_research_themes_id_idx\` ON \`projects_rels\` (\`research_themes_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`projects_rels_publications_id_idx\` ON \`projects_rels\` (\`publications_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`projects_rels_awards_id_idx\` ON \`projects_rels\` (\`awards_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_projects_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_local_name\` text,
  	\`version_abstract\` text,
  	\`version_hero_image_id\` text(36),
  	\`version_start_date\` text,
  	\`version_end_date\` text,
  	\`version_external_url\` text,
  	\`version_content\` text,
  	\`version_status\` text DEFAULT 'ongoing',
  	\`version_featured\` integer DEFAULT false,
  	\`version_published_at\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_parent_idx\` ON \`_projects_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_hero_image_idx\` ON \`_projects_v\` (\`version_hero_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_start_date_idx\` ON \`_projects_v\` (\`version_start_date\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_end_date_idx\` ON \`_projects_v\` (\`version_end_date\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_status_idx\` ON \`_projects_v\` (\`version_status\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_featured_idx\` ON \`_projects_v\` (\`version_featured\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_updated_at_idx\` ON \`_projects_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version_created_at_idx\` ON \`_projects_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_created_at_idx\` ON \`_projects_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_updated_at_idx\` ON \`_projects_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE INDEX \`_projects_v_snapshot_idx\` ON \`_projects_v\` (\`snapshot\`);`)
  await db.run(
    sql`CREATE INDEX \`_projects_v_published_locale_idx\` ON \`_projects_v\` (\`published_locale\`);`,
  )
  await db.run(sql`CREATE INDEX \`_projects_v_latest_idx\` ON \`_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_locales\` (
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` text(36),
  	\`version_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_meta_version_meta_image_idx\` ON \`_projects_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`_projects_v_locales_locale_parent_id_unique\` ON \`_projects_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_projects_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`team_id\` text(36),
  	\`grants_id\` text(36),
  	\`research_themes_id\` text(36),
  	\`publications_id\` text(36),
  	\`awards_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`grants_id\`) REFERENCES \`grants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`research_themes_id\`) REFERENCES \`research_themes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`publications_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`awards_id\`) REFERENCES \`awards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_projects_v_rels_order_idx\` ON \`_projects_v_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_rels_parent_idx\` ON \`_projects_v_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`_projects_v_rels_path_idx\` ON \`_projects_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_projects_v_rels_team_id_idx\` ON \`_projects_v_rels\` (\`team_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_rels_grants_id_idx\` ON \`_projects_v_rels\` (\`grants_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_rels_research_themes_id_idx\` ON \`_projects_v_rels\` (\`research_themes_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_rels_publications_id_idx\` ON \`_projects_v_rels\` (\`publications_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_rels_awards_id_idx\` ON \`_projects_v_rels\` (\`awards_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`awards_recipients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`team_member_id\` text(36),
  	\`custom_recipient_name\` text,
  	\`custom_recipient_orcid\` text,
  	\`custom_recipient_dblp_pid\` text,
  	\`custom_recipient_affiliation_id\` text(36),
  	\`custom_recipient_affiliation_label\` text,
  	FOREIGN KEY (\`team_member_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`custom_recipient_affiliation_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`awards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`awards_recipients_order_idx\` ON \`awards_recipients\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`awards_recipients_parent_id_idx\` ON \`awards_recipients\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`awards_recipients_team_member_idx\` ON \`awards_recipients\` (\`team_member_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`awards_recipients_custom_recipient_custom_recipient_affi_idx\` ON \`awards_recipients\` (\`custom_recipient_affiliation_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`awards\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`year\` numeric NOT NULL,
  	\`end_year\` numeric,
  	\`category\` text,
  	\`scope\` text DEFAULT 'lab',
  	\`organization_id\` text(36),
  	\`organization_label\` text,
  	\`url\` text,
  	\`featured\` integer DEFAULT false,
  	\`provenance_source\` text DEFAULT 'manual',
  	\`provenance_imported_at\` text,
  	\`provenance_source_note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`organization_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`awards_year_idx\` ON \`awards\` (\`year\`);`)
  await db.run(sql`CREATE INDEX \`awards_organization_idx\` ON \`awards\` (\`organization_id\`);`)
  await db.run(sql`CREATE INDEX \`awards_updated_at_idx\` ON \`awards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`awards_created_at_idx\` ON \`awards\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`grants_investigators\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`team_member_id\` text(36),
  	\`custom_investigator_name\` text,
  	\`custom_investigator_orcid\` text,
  	\`custom_investigator_dblp_pid\` text,
  	\`custom_investigator_affiliation_id\` text(36),
  	\`custom_investigator_affiliation_label\` text,
  	\`role\` text DEFAULT 'pi',
  	FOREIGN KEY (\`team_member_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`custom_investigator_affiliation_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`grants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`grants_investigators_order_idx\` ON \`grants_investigators\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`grants_investigators_parent_id_idx\` ON \`grants_investigators\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`grants_investigators_team_member_idx\` ON \`grants_investigators\` (\`team_member_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`grants_investigators_custom_investigator_custom_investig_idx\` ON \`grants_investigators\` (\`custom_investigator_affiliation_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`grants\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`description\` text,
  	\`funder_id\` text(36),
  	\`funder_label\` text,
  	\`grant_number\` text,
  	\`amount_value\` numeric,
  	\`amount_currency\` text DEFAULT 'USD',
  	\`amount_label\` text,
  	\`start_date\` text,
  	\`end_date\` text,
  	\`url\` text,
  	\`status\` text DEFAULT 'active',
  	\`featured\` integer DEFAULT false,
  	\`provenance_source\` text DEFAULT 'manual',
  	\`provenance_imported_at\` text,
  	\`provenance_source_note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`funder_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`grants_slug_idx\` ON \`grants\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`grants_funder_idx\` ON \`grants\` (\`funder_id\`);`)
  await db.run(sql`CREATE INDEX \`grants_updated_at_idx\` ON \`grants\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`grants_created_at_idx\` ON \`grants\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`grants_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`research_themes_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`grants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`research_themes_id\`) REFERENCES \`research_themes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`grants_rels_order_idx\` ON \`grants_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`grants_rels_parent_idx\` ON \`grants_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`grants_rels_path_idx\` ON \`grants_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`grants_rels_research_themes_id_idx\` ON \`grants_rels\` (\`research_themes_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`research_themes\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`short_description\` text,
  	\`featured\` integer DEFAULT false,
  	\`icon_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`research_themes_slug_idx\` ON \`research_themes\` (\`slug\`);`)
  await db.run(
    sql`CREATE INDEX \`research_themes_featured_idx\` ON \`research_themes\` (\`featured\`);`,
  )
  await db.run(sql`CREATE INDEX \`research_themes_icon_idx\` ON \`research_themes\` (\`icon_id\`);`)
  await db.run(
    sql`CREATE INDEX \`research_themes_updated_at_idx\` ON \`research_themes\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`research_themes_created_at_idx\` ON \`research_themes\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`venues\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`short_name\` text,
  	\`type\` text,
  	\`url\` text,
  	\`publisher_id\` text(36),
  	\`wikidata_id\` text,
  	\`openalex_id\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`publisher_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`venues_publisher_idx\` ON \`venues\` (\`publisher_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`venues_openalex_id_idx\` ON \`venues\` (\`openalex_id\`);`)
  await db.run(sql`CREATE INDEX \`venues_updated_at_idx\` ON \`venues\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`venues_created_at_idx\` ON \`venues\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`venues_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`venues\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`venues_texts_order_parent\` ON \`venues_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`venues_texts_text_idx\` ON \`venues_texts\` (\`text\`);`)
  await db.run(sql`CREATE TABLE \`organizations\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`short_name\` text,
  	\`country\` text,
  	\`type\` text,
  	\`url\` text,
  	\`logo_id\` text(36),
  	\`ror_id\` text,
  	\`openalex_id\` text,
  	\`provenance_source\` text DEFAULT 'manual',
  	\`provenance_imported_at\` text,
  	\`provenance_source_note\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`organizations_logo_idx\` ON \`organizations\` (\`logo_id\`);`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`organizations_ror_id_idx\` ON \`organizations\` (\`ror_id\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`organizations_openalex_id_idx\` ON \`organizations\` (\`openalex_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`organizations_updated_at_idx\` ON \`organizations\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`organizations_created_at_idx\` ON \`organizations\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`organizations_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`organizations_texts_order_parent\` ON \`organizations_texts\` (\`order\`,\`parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`import_runs\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`source\` text NOT NULL,
  	\`status\` text DEFAULT 'staged' NOT NULL,
  	\`params\` text,
  	\`raw_input\` text,
  	\`candidates\` text,
  	\`progress_total\` numeric DEFAULT 0,
  	\`progress_processed\` numeric DEFAULT 0,
  	\`progress_created\` numeric DEFAULT 0,
  	\`progress_skipped_existing\` numeric DEFAULT 0,
  	\`progress_failed\` numeric DEFAULT 0,
  	\`lock_token\` text,
  	\`lock_heartbeat_at\` text,
  	\`report_summary\` text,
  	\`error\` text,
  	\`started_at\` text,
  	\`finished_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`import_runs_source_idx\` ON \`import_runs\` (\`source\`);`)
  await db.run(sql`CREATE INDEX \`import_runs_status_idx\` ON \`import_runs\` (\`status\`);`)
  await db.run(
    sql`CREATE INDEX \`import_runs_updated_at_idx\` ON \`import_runs\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`import_runs_created_at_idx\` ON \`import_runs\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`review_items\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`kind\` text NOT NULL,
  	\`status\` text DEFAULT 'open' NOT NULL,
  	\`run_id\` text(36),
  	\`value\` text NOT NULL,
  	\`source_context\` text,
  	\`data\` text,
  	\`resolution\` text,
  	\`resolved_at\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`run_id\`) REFERENCES \`import_runs\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`review_items_kind_idx\` ON \`review_items\` (\`kind\`);`)
  await db.run(sql`CREATE INDEX \`review_items_status_idx\` ON \`review_items\` (\`status\`);`)
  await db.run(sql`CREATE INDEX \`review_items_run_idx\` ON \`review_items\` (\`run_id\`);`)
  await db.run(
    sql`CREATE INDEX \`review_items_updated_at_idx\` ON \`review_items\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`review_items_created_at_idx\` ON \`review_items\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`link_size\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_hero_links_order_idx\` ON \`pages_hero_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_links_parent_id_idx\` ON \`pages_hero_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_links_locales\` (
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_hero_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_links_locales_locale_parent_id_unique\` ON \`pages_hero_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_u_s_ps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon_id\` text(36),
  	FOREIGN KEY (\`icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_hero_u_s_ps_order_idx\` ON \`pages_hero_u_s_ps\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_u_s_ps_parent_id_idx\` ON \`pages_hero_u_s_ps\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_u_s_ps_icon_idx\` ON \`pages_hero_u_s_ps\` (\`icon_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_u_s_ps_locales\` (
  	\`rich_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_hero_u_s_ps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_u_s_ps_locales_locale_parent_id_unique\` ON \`pages_hero_u_s_ps_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_stats_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_hero_stats_items_order_idx\` ON \`pages_hero_stats_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_stats_items_parent_id_idx\` ON \`pages_hero_stats_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_stats_items_locales\` (
  	\`title\` text,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_hero_stats_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_stats_items_locales_locale_parent_id_unique\` ON \`pages_hero_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`image_id\` text(36),
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_hero_tabs_order_idx\` ON \`pages_hero_tabs\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`pages_hero_tabs_parent_id_idx\` ON \`pages_hero_tabs\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_tabs_image_idx\` ON \`pages_hero_tabs\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_hero_tabs_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_hero_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_tabs_locales_locale_parent_id_unique\` ON \`pages_hero_tabs_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`doc_id\` text(36),
  	\`url\` text,
  	\`label\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_breadcrumbs_order_idx\` ON \`pages_breadcrumbs\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_breadcrumbs_parent_id_idx\` ON \`pages_breadcrumbs\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_breadcrumbs_locale_idx\` ON \`pages_breadcrumbs\` (\`_locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_breadcrumbs_doc_idx\` ON \`pages_breadcrumbs\` (\`doc_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`hero_background_color\` text,
  	\`hero_design_version\` text DEFAULT 'none',
  	\`hero_badge_icon\` text,
  	\`hero_badge_link_type\` text DEFAULT 'reference',
  	\`hero_badge_link_new_tab\` integer,
  	\`hero_badge_link_section\` text,
  	\`hero_badge_link_icon_before\` text,
  	\`hero_badge_link_icon_after\` text,
  	\`hero_button_link_type\` text DEFAULT 'reference',
  	\`hero_button_link_new_tab\` integer,
  	\`hero_button_link_section\` text,
  	\`hero_rating\` numeric,
  	\`published_at\` text,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`enable_breadcrumbs\` integer DEFAULT false,
  	\`parent_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_parent_idx\` ON \`pages\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_locales\` (
  	\`hero_badge\` text,
  	\`hero_tagline\` text,
  	\`hero_badge_link_url\` text,
  	\`hero_button_link_url\` text,
  	\`hero_button_link_label\` text,
  	\`hero_rich_text\` text,
  	\`hero_subheading\` text,
  	\`hero_description\` text,
  	\`hero_pricing_headline\` text,
  	\`hero_pricing_price\` text,
  	\`hero_pricing_description\` text,
  	\`hero_presentation_video_label\` text DEFAULT 'Presentation Video',
  	\`hero_presentation_video_video_duration\` text DEFAULT '2 min',
  	\`hero_presentation_video_video_url\` text DEFAULT 'https://library.shadcnblocks.com/videos/block/landscape.mp4',
  	\`meta_title\` text,
  	\`meta_image_id\` text(36),
  	\`meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages_locales\` (\`meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` text(36),
  	\`media_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_media_id_idx\` ON \`pages_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`link_size\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_links_order_idx\` ON \`_pages_v_version_hero_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_links_parent_id_idx\` ON \`_pages_v_version_hero_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_links_locales\` (
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_hero_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_links_locales_locale_parent_id_unique\` ON \`_pages_v_version_hero_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_u_s_ps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`icon_id\` text(36),
  	\`_uuid\` text,
  	FOREIGN KEY (\`icon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_u_s_ps_order_idx\` ON \`_pages_v_version_hero_u_s_ps\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_u_s_ps_parent_id_idx\` ON \`_pages_v_version_hero_u_s_ps\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_u_s_ps_icon_idx\` ON \`_pages_v_version_hero_u_s_ps\` (\`icon_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_u_s_ps_locales\` (
  	\`rich_text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_hero_u_s_ps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_u_s_ps_locales_locale_parent_id_unique\` ON \`_pages_v_version_hero_u_s_ps_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_stats_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_stats_items_order_idx\` ON \`_pages_v_version_hero_stats_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_stats_items_parent_id_idx\` ON \`_pages_v_version_hero_stats_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_stats_items_locales\` (
  	\`title\` text,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_hero_stats_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_stats_items_locales_locale_parent_id_u\` ON \`_pages_v_version_hero_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_tabs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`image_id\` text(36),
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_tabs_order_idx\` ON \`_pages_v_version_hero_tabs\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_tabs_parent_id_idx\` ON \`_pages_v_version_hero_tabs\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_tabs_image_idx\` ON \`_pages_v_version_hero_tabs\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_hero_tabs_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_hero_tabs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_tabs_locales_locale_parent_id_unique\` ON \`_pages_v_version_hero_tabs_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_version_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`doc_id\` text(36),
  	\`url\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_breadcrumbs_order_idx\` ON \`_pages_v_version_breadcrumbs\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_breadcrumbs_parent_id_idx\` ON \`_pages_v_version_breadcrumbs\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_breadcrumbs_locale_idx\` ON \`_pages_v_version_breadcrumbs\` (\`_locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_breadcrumbs_doc_idx\` ON \`_pages_v_version_breadcrumbs\` (\`doc_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_hero_background_color\` text,
  	\`version_hero_design_version\` text DEFAULT 'none',
  	\`version_hero_badge_icon\` text,
  	\`version_hero_badge_link_type\` text DEFAULT 'reference',
  	\`version_hero_badge_link_new_tab\` integer,
  	\`version_hero_badge_link_section\` text,
  	\`version_hero_badge_link_icon_before\` text,
  	\`version_hero_badge_link_icon_after\` text,
  	\`version_hero_button_link_type\` text DEFAULT 'reference',
  	\`version_hero_button_link_new_tab\` integer,
  	\`version_hero_button_link_section\` text,
  	\`version_hero_rating\` numeric,
  	\`version_published_at\` text,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_enable_breadcrumbs\` integer DEFAULT false,
  	\`version_parent_id\` text(36),
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_parent_idx\` ON \`_pages_v\` (\`version_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_snapshot_idx\` ON \`_pages_v\` (\`snapshot\`);`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_published_locale_idx\` ON \`_pages_v\` (\`published_locale\`);`,
  )
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_locales\` (
  	\`version_hero_badge\` text,
  	\`version_hero_tagline\` text,
  	\`version_hero_badge_link_url\` text,
  	\`version_hero_button_link_url\` text,
  	\`version_hero_button_link_label\` text,
  	\`version_hero_rich_text\` text,
  	\`version_hero_subheading\` text,
  	\`version_hero_description\` text,
  	\`version_hero_pricing_headline\` text,
  	\`version_hero_pricing_price\` text,
  	\`version_hero_pricing_description\` text,
  	\`version_hero_presentation_video_label\` text DEFAULT 'Presentation Video',
  	\`version_hero_presentation_video_video_duration\` text DEFAULT '2 min',
  	\`version_hero_presentation_video_video_url\` text DEFAULT 'https://library.shadcnblocks.com/videos/block/landscape.mp4',
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` text(36),
  	\`version_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_meta_version_meta_image_idx\` ON \`_pages_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` text(36),
  	\`media_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_pages_id_idx\` ON \`_pages_v_rels\` (\`pages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_rels_media_id_idx\` ON \`_pages_v_rels\` (\`media_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`posts_case_study3_meta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`posts_case_study3_meta_items_order_idx\` ON \`posts_case_study3_meta_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`posts_case_study3_meta_items_parent_id_idx\` ON \`posts_case_study3_meta_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`posts_case_study3_outcomes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`headline\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`posts_case_study3_outcomes_order_idx\` ON \`posts_case_study3_outcomes\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`posts_case_study3_outcomes_parent_id_idx\` ON \`posts_case_study3_outcomes\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`posts_populated_authors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`posts_populated_authors_order_idx\` ON \`posts_populated_authors\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`posts_populated_authors_parent_id_idx\` ON \`posts_populated_authors\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`posts\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`banner_image_id\` text(36),
  	\`case_study3_hero_image_id\` text(36),
  	\`case_study3_overview\` text,
  	\`case_study3_problem\` text,
  	\`case_study3_approach\` text,
  	\`case_study3_share_label\` text,
  	\`design_version\` text DEFAULT 'BLOGPOST4',
  	\`published_at\` text,
  	\`read_time\` numeric,
  	\`slug\` text,
  	\`slug_lock\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`banner_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`case_study3_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_banner_image_idx\` ON \`posts\` (\`banner_image_id\`);`)
  await db.run(
    sql`CREATE INDEX \`posts_case_study3_case_study3_hero_image_idx\` ON \`posts\` (\`case_study3_hero_image_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`posts_locales\` (
  	\`content\` text,
  	\`meta_title\` text,
  	\`meta_image_id\` text(36),
  	\`meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`posts_meta_meta_image_idx\` ON \`posts_locales\` (\`meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`posts_locales_locale_parent_id_unique\` ON \`posts_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`posts_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`posts_id\` text(36),
  	\`categories_id\` text(36),
  	\`users_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_rels_order_idx\` ON \`posts_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`posts_rels_parent_idx\` ON \`posts_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_rels_path_idx\` ON \`posts_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`posts_rels_posts_id_idx\` ON \`posts_rels\` (\`posts_id\`);`)
  await db.run(
    sql`CREATE INDEX \`posts_rels_categories_id_idx\` ON \`posts_rels\` (\`categories_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`posts_rels_users_id_idx\` ON \`posts_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_version_case_study3_meta_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_case_study3_meta_items_order_idx\` ON \`_posts_v_version_case_study3_meta_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_case_study3_meta_items_parent_id_idx\` ON \`_posts_v_version_case_study3_meta_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_posts_v_version_case_study3_outcomes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`headline\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_case_study3_outcomes_order_idx\` ON \`_posts_v_version_case_study3_outcomes\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_case_study3_outcomes_parent_id_idx\` ON \`_posts_v_version_case_study3_outcomes\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_posts_v_version_populated_authors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_populated_authors_order_idx\` ON \`_posts_v_version_populated_authors\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_populated_authors_parent_id_idx\` ON \`_posts_v_version_populated_authors\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_posts_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_banner_image_id\` text(36),
  	\`version_case_study3_hero_image_id\` text(36),
  	\`version_case_study3_overview\` text,
  	\`version_case_study3_problem\` text,
  	\`version_case_study3_approach\` text,
  	\`version_case_study3_share_label\` text,
  	\`version_design_version\` text DEFAULT 'BLOGPOST4',
  	\`version_published_at\` text,
  	\`version_read_time\` numeric,
  	\`version_slug\` text,
  	\`version_slug_lock\` integer DEFAULT true,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_banner_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_case_study3_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_banner_image_idx\` ON \`_posts_v\` (\`version_banner_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_case_study3_version_case_study3_hero_im_idx\` ON \`_posts_v\` (\`version_case_study3_hero_image_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_snapshot_idx\` ON \`_posts_v\` (\`snapshot\`);`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_published_locale_idx\` ON \`_posts_v\` (\`published_locale\`);`,
  )
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_autosave_idx\` ON \`_posts_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_locales\` (
  	\`version_content\` text,
  	\`version_meta_title\` text,
  	\`version_meta_image_id\` text(36),
  	\`version_meta_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`version_meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_meta_version_meta_image_idx\` ON \`_posts_v_locales\` (\`version_meta_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`_posts_v_locales_locale_parent_id_unique\` ON \`_posts_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_posts_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`posts_id\` text(36),
  	\`categories_id\` text(36),
  	\`users_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_order_idx\` ON \`_posts_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_parent_idx\` ON \`_posts_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_rels_path_idx\` ON \`_posts_v_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_rels_posts_id_idx\` ON \`_posts_v_rels\` (\`posts_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_rels_categories_id_idx\` ON \`_posts_v_rels\` (\`categories_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_rels_users_id_idx\` ON \`_posts_v_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`alt\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_avatar_url\` text,
  	\`sizes_avatar_width\` numeric,
  	\`sizes_avatar_height\` numeric,
  	\`sizes_avatar_mime_type\` text,
  	\`sizes_avatar_filesize\` numeric,
  	\`sizes_avatar_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(
    sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`media_sizes_avatar_sizes_avatar_filename_idx\` ON \`media\` (\`sizes_avatar_filename\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`,
  )
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`categories_breadcrumbs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`doc_id\` text(36),
  	\`url\` text,
  	\`label\` text,
  	FOREIGN KEY (\`doc_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`categories_breadcrumbs_order_idx\` ON \`categories_breadcrumbs\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`categories_breadcrumbs_parent_id_idx\` ON \`categories_breadcrumbs\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`categories_breadcrumbs_locale_idx\` ON \`categories_breadcrumbs\` (\`_locale\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`categories_breadcrumbs_doc_idx\` ON \`categories_breadcrumbs\` (\`doc_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`categories\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`parent_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`categories_parent_idx\` ON \`categories\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`sub\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sub_idx\` ON \`users\` (\`sub\`);`)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`users_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`roles_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`roles_id\`) REFERENCES \`roles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_rels_order_idx\` ON \`users_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_parent_idx\` ON \`users_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_path_idx\` ON \`users_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`users_rels_roles_id_idx\` ON \`users_rels\` (\`roles_id\`);`)
  await db.run(sql`CREATE TABLE \`roles\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`permissions_can_manage_content\` integer DEFAULT false,
  	\`permissions_can_publish\` integer DEFAULT false,
  	\`permissions_can_manage_users\` integer DEFAULT false,
  	\`permissions_can_manage_redirects\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`roles_name_idx\` ON \`roles\` (\`name\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`roles_slug_idx\` ON \`roles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`roles_updated_at_idx\` ON \`roles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`roles_created_at_idx\` ON \`roles\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`redirects\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`from\` text NOT NULL,
  	\`to_type\` text DEFAULT 'reference',
  	\`to_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`redirects_from_idx\` ON \`redirects\` (\`from\`);`)
  await db.run(sql`CREATE INDEX \`redirects_updated_at_idx\` ON \`redirects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`redirects_created_at_idx\` ON \`redirects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`redirects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` text(36),
  	\`posts_id\` text(36),
  	\`projects_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`redirects_rels_order_idx\` ON \`redirects_rels\` (\`order\`);`)
  await db.run(
    sql`CREATE INDEX \`redirects_rels_parent_idx\` ON \`redirects_rels\` (\`parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`redirects_rels_path_idx\` ON \`redirects_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`redirects_rels_pages_id_idx\` ON \`redirects_rels\` (\`pages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`redirects_rels_posts_id_idx\` ON \`redirects_rels\` (\`posts_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`redirects_rels_projects_id_idx\` ON \`redirects_rels\` (\`projects_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_checkbox\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`required\` integer,
  	\`default_value\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_checkbox_order_idx\` ON \`forms_blocks_checkbox\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_checkbox_parent_id_idx\` ON \`forms_blocks_checkbox\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_checkbox_path_idx\` ON \`forms_blocks_checkbox\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_checkbox_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_checkbox\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_checkbox_locales_locale_parent_id_unique\` ON \`forms_blocks_checkbox_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_country\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_country_order_idx\` ON \`forms_blocks_country\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_country_parent_id_idx\` ON \`forms_blocks_country\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_country_path_idx\` ON \`forms_blocks_country\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_country_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_country\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_country_locales_locale_parent_id_unique\` ON \`forms_blocks_country_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_email\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_email_order_idx\` ON \`forms_blocks_email\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_email_parent_id_idx\` ON \`forms_blocks_email\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_email_path_idx\` ON \`forms_blocks_email\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_email_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_email\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_email_locales_locale_parent_id_unique\` ON \`forms_blocks_email_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_message\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_message_order_idx\` ON \`forms_blocks_message\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_message_parent_id_idx\` ON \`forms_blocks_message\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_message_path_idx\` ON \`forms_blocks_message\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_message_locales\` (
  	\`message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_message\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_message_locales_locale_parent_id_unique\` ON \`forms_blocks_message_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_number\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`default_value\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_number_order_idx\` ON \`forms_blocks_number\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_number_parent_id_idx\` ON \`forms_blocks_number\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_number_path_idx\` ON \`forms_blocks_number\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_number_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_number\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_number_locales_locale_parent_id_unique\` ON \`forms_blocks_number_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_select_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_options_order_idx\` ON \`forms_blocks_select_options\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_options_parent_id_idx\` ON \`forms_blocks_select_options\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_select_options_locales\` (
  	\`label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select_options\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_options_locales_locale_parent_id_unique\` ON \`forms_blocks_select_options_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_select\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`placeholder\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_order_idx\` ON \`forms_blocks_select\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_parent_id_idx\` ON \`forms_blocks_select\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_path_idx\` ON \`forms_blocks_select\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_select_locales\` (
  	\`label\` text,
  	\`default_value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_locales_locale_parent_id_unique\` ON \`forms_blocks_select_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_state\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_state_order_idx\` ON \`forms_blocks_state\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_state_parent_id_idx\` ON \`forms_blocks_state\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_state_path_idx\` ON \`forms_blocks_state\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_state_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_state\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_state_locales_locale_parent_id_unique\` ON \`forms_blocks_state_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_text_order_idx\` ON \`forms_blocks_text\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_text_parent_id_idx\` ON \`forms_blocks_text\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_text_path_idx\` ON \`forms_blocks_text\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_text_locales\` (
  	\`label\` text,
  	\`default_value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_text_locales_locale_parent_id_unique\` ON \`forms_blocks_text_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_textarea\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_textarea_order_idx\` ON \`forms_blocks_textarea\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_textarea_parent_id_idx\` ON \`forms_blocks_textarea\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_textarea_path_idx\` ON \`forms_blocks_textarea\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_textarea_locales\` (
  	\`label\` text,
  	\`default_value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_textarea\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_textarea_locales_locale_parent_id_unique\` ON \`forms_blocks_textarea_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_telephone\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_blocks_telephone_order_idx\` ON \`forms_blocks_telephone\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_telephone_parent_id_idx\` ON \`forms_blocks_telephone\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_telephone_path_idx\` ON \`forms_blocks_telephone\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_blocks_telephone_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_telephone\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_telephone_locales_locale_parent_id_unique\` ON \`forms_blocks_telephone_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_emails\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email_to\` text,
  	\`cc\` text,
  	\`bcc\` text,
  	\`reply_to\` text,
  	\`email_from\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_emails_order_idx\` ON \`forms_emails\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`forms_emails_parent_id_idx\` ON \`forms_emails\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_emails_locales\` (
  	\`subject\` text DEFAULT 'You''ve received a new message.' NOT NULL,
  	\`message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_emails\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_emails_locales_locale_parent_id_unique\` ON \`forms_emails_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`confirmation_type\` text DEFAULT 'message',
  	\`redirect_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`forms_locales\` (
  	\`submit_button_label\` text,
  	\`confirmation_message\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_locales_locale_parent_id_unique\` ON \`forms_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`form_submissions_submission_data\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`form_submissions_submission_data_order_idx\` ON \`form_submissions_submission_data\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`form_submissions_submission_data_parent_id_idx\` ON \`form_submissions_submission_data\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`form_submissions\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`form_id\` text(36) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE INDEX \`form_submissions_form_idx\` ON \`form_submissions\` (\`form_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`search_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`relation_to\` text,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`search_categories_order_idx\` ON \`search_categories\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`search_categories_parent_id_idx\` ON \`search_categories\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`search\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`priority\` numeric,
  	\`slug\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` text(36),
  	\`meta_extracted_text\` text,
  	\`meta_search_keywords\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`search_slug_idx\` ON \`search\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`search_meta_meta_image_idx\` ON \`search\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`search_updated_at_idx\` ON \`search\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`search_created_at_idx\` ON \`search\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`search_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`search_locales_locale_parent_id_unique\` ON \`search_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`search_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` text(36),
  	\`posts_id\` text(36),
  	\`projects_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`search_rels_order_idx\` ON \`search_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`search_rels_parent_idx\` ON \`search_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`search_rels_path_idx\` ON \`search_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`search_rels_pages_id_idx\` ON \`search_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`search_rels_posts_id_idx\` ON \`search_rels\` (\`posts_id\`);`)
  await db.run(
    sql`CREATE INDEX \`search_rels_projects_id_idx\` ON \`search_rels\` (\`projects_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_jobs_log\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`executed_at\` text NOT NULL,
  	\`completed_at\` text NOT NULL,
  	\`task_slug\` text NOT NULL,
  	\`task_i_d\` text NOT NULL,
  	\`input\` text,
  	\`output\` text,
  	\`state\` text NOT NULL,
  	\`error\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payload_jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_jobs_log_order_idx\` ON \`payload_jobs_log\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_log_parent_id_idx\` ON \`payload_jobs_log\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_jobs\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`input\` text,
  	\`completed_at\` text,
  	\`total_tried\` numeric DEFAULT 0,
  	\`has_error\` integer DEFAULT false,
  	\`error\` text,
  	\`task_slug\` text,
  	\`queue\` text DEFAULT 'default',
  	\`wait_until\` text,
  	\`processing\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_jobs_completed_at_idx\` ON \`payload_jobs\` (\`completed_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_total_tried_idx\` ON \`payload_jobs\` (\`total_tried\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_has_error_idx\` ON \`payload_jobs\` (\`has_error\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_task_slug_idx\` ON \`payload_jobs\` (\`task_slug\`);`,
  )
  await db.run(sql`CREATE INDEX \`payload_jobs_queue_idx\` ON \`payload_jobs\` (\`queue\`);`)
  await db.run(
    sql`CREATE INDEX \`payload_jobs_wait_until_idx\` ON \`payload_jobs\` (\`wait_until\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_processing_idx\` ON \`payload_jobs\` (\`processing\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_updated_at_idx\` ON \`payload_jobs\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_created_at_idx\` ON \`payload_jobs\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`publications_id\` text(36),
  	\`team_id\` text(36),
  	\`news_id\` text(36),
  	\`projects_id\` text(36),
  	\`awards_id\` text(36),
  	\`grants_id\` text(36),
  	\`research_themes_id\` text(36),
  	\`venues_id\` text(36),
  	\`organizations_id\` text(36),
  	\`import_runs_id\` text(36),
  	\`review_items_id\` text(36),
  	\`pages_id\` text(36),
  	\`posts_id\` text(36),
  	\`media_id\` text(36),
  	\`categories_id\` text(36),
  	\`users_id\` text(36),
  	\`roles_id\` text(36),
  	\`redirects_id\` text(36),
  	\`forms_id\` text(36),
  	\`form_submissions_id\` text(36),
  	\`search_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`publications_id\`) REFERENCES \`publications\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`awards_id\`) REFERENCES \`awards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`grants_id\`) REFERENCES \`grants\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`research_themes_id\`) REFERENCES \`research_themes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`venues_id\`) REFERENCES \`venues\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`organizations_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`import_runs_id\`) REFERENCES \`import_runs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`review_items_id\`) REFERENCES \`review_items\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`roles_id\`) REFERENCES \`roles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`search_id\`) REFERENCES \`search\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_publications_id_idx\` ON \`payload_locked_documents_rels\` (\`publications_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_team_id_idx\` ON \`payload_locked_documents_rels\` (\`team_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_awards_id_idx\` ON \`payload_locked_documents_rels\` (\`awards_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_grants_id_idx\` ON \`payload_locked_documents_rels\` (\`grants_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_research_themes_id_idx\` ON \`payload_locked_documents_rels\` (\`research_themes_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_venues_id_idx\` ON \`payload_locked_documents_rels\` (\`venues_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_organizations_id_idx\` ON \`payload_locked_documents_rels\` (\`organizations_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_import_runs_id_idx\` ON \`payload_locked_documents_rels\` (\`import_runs_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_review_items_id_idx\` ON \`payload_locked_documents_rels\` (\`review_items_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_roles_id_idx\` ON \`payload_locked_documents_rels\` (\`roles_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_search_id_idx\` ON \`payload_locked_documents_rels\` (\`search_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`theme_config\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`radius\` text DEFAULT '0.6rem',
  	\`regular_colors_background\` text DEFAULT 'hsl(0, 0%, 100%)',
  	\`regular_colors_foreground\` text DEFAULT 'hsl(222.2, 84%, 4.9%)',
  	\`regular_colors_card\` text DEFAULT 'hsl(240, 5%, 96%)',
  	\`regular_colors_card_foreground\` text DEFAULT 'hsl(222.2, 84%, 4.9%)',
  	\`regular_colors_popover\` text DEFAULT 'hsl(0, 0%, 100%)',
  	\`regular_colors_popover_foreground\` text DEFAULT 'hsl(222.2, 84%, 4.9%)',
  	\`regular_colors_primary\` text DEFAULT 'hsl(222.2, 47.4%, 11.2%)',
  	\`regular_colors_primary_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`regular_colors_secondary\` text DEFAULT 'hsl(210, 40%, 96.1%)',
  	\`regular_colors_secondary_foreground\` text DEFAULT 'hsl(222.2, 47.4%, 11.2%)',
  	\`regular_colors_muted\` text DEFAULT 'hsl(210, 40%, 96.1%)',
  	\`regular_colors_muted_foreground\` text DEFAULT 'hsl(215.4, 16.3%, 46.9%)',
  	\`regular_colors_accent\` text DEFAULT 'hsl(210, 40%, 96.1%)',
  	\`regular_colors_accent_foreground\` text DEFAULT 'hsl(222.2, 47.4%, 11.2%)',
  	\`regular_colors_destructive\` text DEFAULT 'hsl(0, 84.2%, 60.2%)',
  	\`regular_colors_destructive_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`regular_colors_border\` text DEFAULT 'hsl(240, 6%, 90%)',
  	\`regular_colors_input\` text DEFAULT 'hsl(214.3, 31.8%, 91.4%)',
  	\`regular_colors_ring_3\` text DEFAULT 'hsl(222.2, 84%, 4.9%)',
  	\`regular_colors_success\` text DEFAULT 'hsl(196, 52%, 74%)',
  	\`regular_colors_warning\` text DEFAULT 'hsl(34, 89%, 85%)',
  	\`regular_colors_error\` text DEFAULT 'hsl(10, 100%, 86%)',
  	\`regular_colors_chart_1\` text DEFAULT 'hsl(12, 76%, 61%)',
  	\`regular_colors_chart_2\` text DEFAULT 'hsl(173, 58%, 39%)',
  	\`regular_colors_chart_3\` text DEFAULT 'hsl(197, 37%, 24%)',
  	\`regular_colors_chart_4\` text DEFAULT 'hsl(43, 74%, 66%)',
  	\`regular_colors_chart_5\` text DEFAULT 'hsl(27, 87%, 67%)',
  	\`regular_colors_muted2\` text DEFAULT 'hsl(0, 0%, 91%)',
  	\`regular_colors_muted2_foreground\` text DEFAULT 'hsl(240, 3.8%, 46.1%)',
  	\`darkmode_colors_enable_dark_mode\` integer,
  	\`darkmode_colors_background\` text DEFAULT 'hsl(0, 0%, 0%)',
  	\`darkmode_colors_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`darkmode_colors_card\` text DEFAULT 'hsl(240, 6%, 10%)',
  	\`darkmode_colors_card_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`darkmode_colors_popover\` text DEFAULT 'hsl(222.2 84%, 4.9%)',
  	\`darkmode_colors_popover_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`darkmode_colors_primary\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`darkmode_colors_primary_foreground\` text DEFAULT 'hsl(222.2 47.4%, 11.2%)',
  	\`darkmode_colors_secondary\` text DEFAULT 'hsl(217.2 32.6%, 17.5%)',
  	\`darkmode_colors_secondary_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`darkmode_colors_muted\` text DEFAULT 'hsl(217.2 32.6%, 17.5%)',
  	\`darkmode_colors_muted_foreground\` text DEFAULT 'hsl(215, 20.2%, 65.1%)',
  	\`darkmode_colors_accent\` text DEFAULT 'hsl(217.2 32.6%, 17.5%)',
  	\`darkmode_colors_accent_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`darkmode_colors_destructive\` text DEFAULT 'hsl(0, 62.8%, 30.6%)',
  	\`darkmode_colors_destructive_foreground\` text DEFAULT 'hsl(210, 40%, 98%)',
  	\`darkmode_colors_border\` text DEFAULT 'hsl(240, 4%, 16%)',
  	\`darkmode_colors_input\` text DEFAULT 'hsl(217.2 32.6%, 17.5%)',
  	\`darkmode_colors_ring_3\` text DEFAULT 'hsl(212,.7 26.8%, 83.9%)',
  	\`darkmode_colors_success\` text DEFAULT 'hsl(196, 100%, 14%)',
  	\`darkmode_colors_warning\` text DEFAULT 'hsl(34, 51%, 25%)',
  	\`darkmode_colors_error\` text DEFAULT 'hsl(10, 39%, 43%)',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`header_blocks_sub_subitems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_sub\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_subitems_order_idx\` ON \`header_blocks_sub_subitems\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_subitems_parent_id_idx\` ON \`header_blocks_sub_subitems\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_sub_subitems_locales\` (
  	\`link_url\` text,
  	\`link_label\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_sub_subitems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_sub_subitems_locales_locale_parent_id_unique\` ON \`header_blocks_sub_subitems_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_sub\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_order_idx\` ON \`header_blocks_sub\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_parent_id_idx\` ON \`header_blocks_sub\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_path_idx\` ON \`header_blocks_sub\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_sub_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_sub\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_sub_locales_locale_parent_id_unique\` ON \`header_blocks_sub_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_link\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_link_order_idx\` ON \`header_blocks_link\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_link_parent_id_idx\` ON \`header_blocks_link\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_link_path_idx\` ON \`header_blocks_link\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_link_locales\` (
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_link\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_link_locales_locale_parent_id_unique\` ON \`header_blocks_link_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_featured_banner\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`background_color\` text DEFAULT 'primary',
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`link_size\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_banner_order_idx\` ON \`header_blocks_featured_banner\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_banner_parent_id_idx\` ON \`header_blocks_featured_banner\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_banner_path_idx\` ON \`header_blocks_featured_banner\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_banner_image_idx\` ON \`header_blocks_featured_banner\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_featured_banner_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`description\` text,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_featured_banner\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_featured_banner_locales_locale_parent_id_uniqu\` ON \`header_blocks_featured_banner_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_category_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_category_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_items_order_idx\` ON \`header_blocks_category_grid_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_items_parent_id_idx\` ON \`header_blocks_category_grid_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_category_grid_items_locales\` (
  	\`title\` text,
  	\`description\` text,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_category_grid_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_category_grid_items_locales_locale_parent_id_u\` ON \`header_blocks_category_grid_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_category_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_order_idx\` ON \`header_blocks_category_grid\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_parent_id_idx\` ON \`header_blocks_category_grid\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_path_idx\` ON \`header_blocks_category_grid\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_category_grid_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_category_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_category_grid_locales_locale_parent_id_unique\` ON \`header_blocks_category_grid_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_card_grid_cards_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_card_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_links_order_idx\` ON \`header_blocks_card_grid_cards_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_links_parent_id_idx\` ON \`header_blocks_card_grid_cards_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_card_grid_cards_links_locales\` (
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_card_grid_cards_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_cards_links_locales_locale_parent_id\` ON \`header_blocks_card_grid_cards_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_card_grid_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_order_idx\` ON \`header_blocks_card_grid_cards\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_parent_id_idx\` ON \`header_blocks_card_grid_cards\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_card_grid_cards_locales\` (
  	\`title\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_card_grid_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_cards_locales_locale_parent_id_uniqu\` ON \`header_blocks_card_grid_cards_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_card_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_order_idx\` ON \`header_blocks_card_grid\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_parent_id_idx\` ON \`header_blocks_card_grid\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_path_idx\` ON \`header_blocks_card_grid\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_card_grid_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_card_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_locales_locale_parent_id_unique\` ON \`header_blocks_card_grid_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_feature_list_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_feature_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_features_order_idx\` ON \`header_blocks_feature_list_features\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_features_parent_id_idx\` ON \`header_blocks_feature_list_features\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_feature_list_features_locales\` (
  	\`title\` text,
  	\`description\` text,
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_feature_list_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_feature_list_features_locales_locale_parent_id\` ON \`header_blocks_feature_list_features_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_feature_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_order_idx\` ON \`header_blocks_feature_list\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_parent_id_idx\` ON \`header_blocks_feature_list\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_path_idx\` ON \`header_blocks_feature_list\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_feature_list_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_feature_list\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_feature_list_locales_locale_parent_id_unique\` ON \`header_blocks_feature_list_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_simple_links_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_simple_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_links_order_idx\` ON \`header_blocks_simple_links_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_links_parent_id_idx\` ON \`header_blocks_simple_links_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_simple_links_links_locales\` (
  	\`link_url\` text,
  	\`link_label\` text,
  	\`description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_simple_links_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_simple_links_links_locales_locale_parent_id_un\` ON \`header_blocks_simple_links_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_simple_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_order_idx\` ON \`header_blocks_simple_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_parent_id_idx\` ON \`header_blocks_simple_links\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_path_idx\` ON \`header_blocks_simple_links\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_simple_links_locales\` (
  	\`title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_simple_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_simple_links_locales_locale_parent_id_unique\` ON \`header_blocks_simple_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_featured_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`background_color\` text DEFAULT 'primary',
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_image_order_idx\` ON \`header_blocks_featured_image\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_image_parent_id_idx\` ON \`header_blocks_featured_image\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_image_path_idx\` ON \`header_blocks_featured_image\` (\`_path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_image_image_idx\` ON \`header_blocks_featured_image\` (\`image_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_featured_image_locales\` (
  	\`title\` text,
  	\`subtitle\` text,
  	\`description\` text,
  	\`link_url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_featured_image\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_featured_image_locales_locale_parent_id_unique\` ON \`header_blocks_featured_image_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_submenu\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`header_blocks_submenu_order_idx\` ON \`header_blocks_submenu\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_submenu_parent_id_idx\` ON \`header_blocks_submenu\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_submenu_path_idx\` ON \`header_blocks_submenu\` (\`_path\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_blocks_submenu_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_blocks_submenu\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_submenu_locales_locale_parent_id_unique\` ON \`header_blocks_submenu_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	\`link_appearance\` text DEFAULT 'default',
  	\`link_size\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_buttons_order_idx\` ON \`header_buttons\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`header_buttons_parent_id_idx\` ON \`header_buttons\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_buttons_locales\` (
  	\`link_url\` text,
  	\`link_label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_buttons_locales_locale_parent_id_unique\` ON \`header_buttons_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`background_color\` text,
  	\`design_version\` text DEFAULT '1' NOT NULL,
  	\`is_search_enabled\` integer DEFAULT false,
  	\`logo_id\` text(36) NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`header_logo_idx\` ON \`header\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`header_locales\` (
  	\`copyright\` text DEFAULT 'Copyright © All Rights Reserved.',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_locales_locale_parent_id_unique\` ON \`header_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`header_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`header\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`header_rels_order_idx\` ON \`header_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`header_rels_parent_idx\` ON \`header_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`header_rels_path_idx\` ON \`header_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`header_rels_pages_id_idx\` ON \`header_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_legal_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`footer_legal_links_order_idx\` ON \`footer_legal_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_legal_links_parent_id_idx\` ON \`footer_legal_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_legal_links_locales\` (
  	\`link_url\` text,
  	\`link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_legal_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_legal_links_locales_locale_parent_id_unique\` ON \`footer_legal_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`footer_social_links_order_idx\` ON \`footer_social_links\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_social_links_parent_id_idx\` ON \`footer_social_links\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_social_links_locales\` (
  	\`url\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_social_links\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_social_links_locales_locale_parent_id_unique\` ON \`footer_social_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_nav_items_sub_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`link_type\` text DEFAULT 'reference',
  	\`link_new_tab\` integer,
  	\`link_section\` text,
  	\`link_icon_before\` text,
  	\`link_icon_after\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_nav_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_sub_nav_items_order_idx\` ON \`footer_nav_items_sub_nav_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_sub_nav_items_parent_id_idx\` ON \`footer_nav_items_sub_nav_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_nav_items_sub_nav_items_locales\` (
  	\`link_url\` text,
  	\`link_label\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_nav_items_sub_nav_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_nav_items_sub_nav_items_locales_locale_parent_id_uniq\` ON \`footer_nav_items_sub_nav_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_nav_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_order_idx\` ON \`footer_nav_items\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_parent_id_idx\` ON \`footer_nav_items\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_nav_items_locales\` (
  	\`title\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer_nav_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_nav_items_locales_locale_parent_id_unique\` ON \`footer_nav_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`background_color\` text,
  	\`design_version\` text,
  	\`logo_id\` text(36),
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_logo_idx\` ON \`footer\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`footer_locales\` (
  	\`copyright\` text DEFAULT 'Company Name. All rights reserved.',
  	\`subline\` text DEFAULT 'Components made easy. This cool starter template will help you get started with your next project.',
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_locales_locale_parent_id_unique\` ON \`footer_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`footer_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`footer_rels_order_idx\` ON \`footer_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_parent_idx\` ON \`footer_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_path_idx\` ON \`footer_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`footer_rels_pages_id_idx\` ON \`footer_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE TABLE \`page_config\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`open_graph_text_color\` text DEFAULT '#000000',
  	\`open_graph_text_position\` text DEFAULT 'center',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`page_config_locales\` (
  	\`default_meta_title\` text NOT NULL,
  	\`default_meta_description\` text NOT NULL,
  	\`open_graph_background_image_id\` text(36),
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`open_graph_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`page_config\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`page_config_open_graph_open_graph_background_image_idx\` ON \`page_config_locales\` (\`open_graph_background_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`page_config_locales_locale_parent_id_unique\` ON \`page_config_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`_page_config_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`version_open_graph_text_color\` text DEFAULT '#000000',
  	\`version_open_graph_text_position\` text DEFAULT 'center',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_page_config_v_created_at_idx\` ON \`_page_config_v\` (\`created_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_page_config_v_updated_at_idx\` ON \`_page_config_v\` (\`updated_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`_page_config_v_locales\` (
  	\`version_default_meta_title\` text NOT NULL,
  	\`version_default_meta_description\` text NOT NULL,
  	\`version_open_graph_background_image_id\` text(36),
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	FOREIGN KEY (\`version_open_graph_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_page_config_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`_page_config_v_version_open_graph_version_open_graph_bac_idx\` ON \`_page_config_v_locales\` (\`version_open_graph_background_image_id\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`_page_config_v_locales_locale_parent_id_unique\` ON \`_page_config_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`lab_info_socials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lab_info\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`lab_info_socials_order_idx\` ON \`lab_info_socials\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`lab_info_socials_parent_id_idx\` ON \`lab_info_socials\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`lab_info\` (
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
  await db.run(sql`CREATE INDEX \`lab_info_logo_idx\` ON \`lab_info\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`lab_info_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`organizations_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`lab_info\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`organizations_id\`) REFERENCES \`organizations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`lab_info_rels_order_idx\` ON \`lab_info_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`lab_info_rels_parent_idx\` ON \`lab_info_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`lab_info_rels_path_idx\` ON \`lab_info_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`lab_info_rels_organizations_id_idx\` ON \`lab_info_rels\` (\`organizations_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`publications_authors\`;`)
  await db.run(sql`DROP TABLE \`publications\`;`)
  await db.run(sql`DROP TABLE \`publications_texts\`;`)
  await db.run(sql`DROP TABLE \`publications_rels\`;`)
  await db.run(sql`DROP TABLE \`team_socials\`;`)
  await db.run(sql`DROP TABLE \`team\`;`)
  await db.run(sql`DROP TABLE \`team_texts\`;`)
  await db.run(sql`DROP TABLE \`news\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`DROP TABLE \`projects_locales\`;`)
  await db.run(sql`DROP TABLE \`projects_rels\`;`)
  await db.run(sql`DROP TABLE \`_projects_v\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_rels\`;`)
  await db.run(sql`DROP TABLE \`awards_recipients\`;`)
  await db.run(sql`DROP TABLE \`awards\`;`)
  await db.run(sql`DROP TABLE \`grants_investigators\`;`)
  await db.run(sql`DROP TABLE \`grants\`;`)
  await db.run(sql`DROP TABLE \`grants_rels\`;`)
  await db.run(sql`DROP TABLE \`research_themes\`;`)
  await db.run(sql`DROP TABLE \`venues\`;`)
  await db.run(sql`DROP TABLE \`venues_texts\`;`)
  await db.run(sql`DROP TABLE \`organizations\`;`)
  await db.run(sql`DROP TABLE \`organizations_texts\`;`)
  await db.run(sql`DROP TABLE \`import_runs\`;`)
  await db.run(sql`DROP TABLE \`review_items\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_links\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_links_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_u_s_ps\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_u_s_ps_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_stats_items\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_stats_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_tabs\`;`)
  await db.run(sql`DROP TABLE \`pages_hero_tabs_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_breadcrumbs\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_links\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_links_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_u_s_ps\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_u_s_ps_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_stats_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_stats_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_tabs\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_hero_tabs_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_breadcrumbs\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`posts_case_study3_meta_items\`;`)
  await db.run(sql`DROP TABLE \`posts_case_study3_outcomes\`;`)
  await db.run(sql`DROP TABLE \`posts_populated_authors\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts_locales\`;`)
  await db.run(sql`DROP TABLE \`posts_rels\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_version_case_study3_meta_items\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_version_case_study3_outcomes\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_version_populated_authors\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_locales\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_rels\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`media_locales\`;`)
  await db.run(sql`DROP TABLE \`categories_breadcrumbs\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`users_rels\`;`)
  await db.run(sql`DROP TABLE \`roles\`;`)
  await db.run(sql`DROP TABLE \`redirects\`;`)
  await db.run(sql`DROP TABLE \`redirects_rels\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_checkbox\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_checkbox_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_country\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_country_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_email\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_email_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_message\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_message_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_number\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_number_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_options\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_options_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_state\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_state_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_text_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_textarea\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_textarea_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_telephone\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_telephone_locales\`;`)
  await db.run(sql`DROP TABLE \`forms_emails\`;`)
  await db.run(sql`DROP TABLE \`forms_emails_locales\`;`)
  await db.run(sql`DROP TABLE \`forms\`;`)
  await db.run(sql`DROP TABLE \`forms_locales\`;`)
  await db.run(sql`DROP TABLE \`form_submissions_submission_data\`;`)
  await db.run(sql`DROP TABLE \`form_submissions\`;`)
  await db.run(sql`DROP TABLE \`search_categories\`;`)
  await db.run(sql`DROP TABLE \`search\`;`)
  await db.run(sql`DROP TABLE \`search_locales\`;`)
  await db.run(sql`DROP TABLE \`search_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_jobs_log\`;`)
  await db.run(sql`DROP TABLE \`payload_jobs\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`theme_config\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_sub_subitems\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_sub_subitems_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_sub\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_sub_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_link\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_link_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_featured_banner\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_featured_banner_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_category_grid_items\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_category_grid_items_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_category_grid\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_category_grid_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_card_grid_cards_links\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_card_grid_cards_links_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_card_grid_cards\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_card_grid_cards_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_card_grid\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_card_grid_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_feature_list_features\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_feature_list_features_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_feature_list\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_feature_list_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_simple_links_links\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_simple_links_links_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_simple_links\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_simple_links_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_featured_image\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_featured_image_locales\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_submenu\`;`)
  await db.run(sql`DROP TABLE \`header_blocks_submenu_locales\`;`)
  await db.run(sql`DROP TABLE \`header_buttons\`;`)
  await db.run(sql`DROP TABLE \`header_buttons_locales\`;`)
  await db.run(sql`DROP TABLE \`header\`;`)
  await db.run(sql`DROP TABLE \`header_locales\`;`)
  await db.run(sql`DROP TABLE \`header_rels\`;`)
  await db.run(sql`DROP TABLE \`footer_legal_links\`;`)
  await db.run(sql`DROP TABLE \`footer_legal_links_locales\`;`)
  await db.run(sql`DROP TABLE \`footer_social_links\`;`)
  await db.run(sql`DROP TABLE \`footer_social_links_locales\`;`)
  await db.run(sql`DROP TABLE \`footer_nav_items_sub_nav_items\`;`)
  await db.run(sql`DROP TABLE \`footer_nav_items_sub_nav_items_locales\`;`)
  await db.run(sql`DROP TABLE \`footer_nav_items\`;`)
  await db.run(sql`DROP TABLE \`footer_nav_items_locales\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer_locales\`;`)
  await db.run(sql`DROP TABLE \`footer_rels\`;`)
  await db.run(sql`DROP TABLE \`page_config\`;`)
  await db.run(sql`DROP TABLE \`page_config_locales\`;`)
  await db.run(sql`DROP TABLE \`_page_config_v\`;`)
  await db.run(sql`DROP TABLE \`_page_config_v_locales\`;`)
  await db.run(sql`DROP TABLE \`lab_info_socials\`;`)
  await db.run(sql`DROP TABLE \`lab_info\`;`)
  await db.run(sql`DROP TABLE \`lab_info_rels\`;`)
}
