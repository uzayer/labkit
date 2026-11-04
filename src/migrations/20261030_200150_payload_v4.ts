import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Payload 4 stores _status per locale for drafts-enabled collections with localized
  // fields, with no opt-out. Copy each document's and version's status into its 'en'
  // locale row (creating the row where none exists) before the old columns are dropped;
  // otherwise every document would fall back to the column default, 'draft'.
  await db.run(sql`ALTER TABLE \`projects_locales\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(
    sql`INSERT INTO \`projects_locales\` (\`_locale\`, \`_parent_id\`) SELECT 'en', \`id\` FROM \`projects\` WHERE NOT EXISTS (SELECT 1 FROM \`projects_locales\` l WHERE l.\`_parent_id\` = \`projects\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(
    sql`UPDATE \`projects_locales\` SET \`_status\` = (SELECT \`_status\` FROM \`projects\` WHERE \`projects\`.\`id\` = \`projects_locales\`.\`_parent_id\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`_projects_v_locales\` ADD \`version__status\` text DEFAULT 'draft';`,
  )
  await db.run(
    sql`INSERT INTO \`_projects_v_locales\` (\`_locale\`, \`_parent_id\`) SELECT 'en', \`id\` FROM \`_projects_v\` WHERE NOT EXISTS (SELECT 1 FROM \`_projects_v_locales\` l WHERE l.\`_parent_id\` = \`_projects_v\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(
    sql`UPDATE \`_projects_v_locales\` SET \`version__status\` = (SELECT \`version__status\` FROM \`_projects_v\` WHERE \`_projects_v\`.\`id\` = \`_projects_v_locales\`.\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_locales\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(
    sql`INSERT INTO \`pages_locales\` (\`_locale\`, \`_parent_id\`) SELECT 'en', \`id\` FROM \`pages\` WHERE NOT EXISTS (SELECT 1 FROM \`pages_locales\` l WHERE l.\`_parent_id\` = \`pages\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(
    sql`UPDATE \`pages_locales\` SET \`_status\` = (SELECT \`_status\` FROM \`pages\` WHERE \`pages\`.\`id\` = \`pages_locales\`.\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` ADD \`version__status\` text DEFAULT 'draft';`)
  await db.run(
    sql`INSERT INTO \`_pages_v_locales\` (\`_locale\`, \`_parent_id\`) SELECT 'en', \`id\` FROM \`_pages_v\` WHERE NOT EXISTS (SELECT 1 FROM \`_pages_v_locales\` l WHERE l.\`_parent_id\` = \`_pages_v\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(
    sql`UPDATE \`_pages_v_locales\` SET \`version__status\` = (SELECT \`version__status\` FROM \`_pages_v\` WHERE \`_pages_v\`.\`id\` = \`_pages_v_locales\`.\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`posts_locales\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(
    sql`INSERT INTO \`posts_locales\` (\`_locale\`, \`_parent_id\`) SELECT 'en', \`id\` FROM \`posts\` WHERE NOT EXISTS (SELECT 1 FROM \`posts_locales\` l WHERE l.\`_parent_id\` = \`posts\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(
    sql`UPDATE \`posts_locales\` SET \`_status\` = (SELECT \`_status\` FROM \`posts\` WHERE \`posts\`.\`id\` = \`posts_locales\`.\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` ADD \`version__status\` text DEFAULT 'draft';`)
  await db.run(
    sql`INSERT INTO \`_posts_v_locales\` (\`_locale\`, \`_parent_id\`) SELECT 'en', \`id\` FROM \`_posts_v\` WHERE NOT EXISTS (SELECT 1 FROM \`_posts_v_locales\` l WHERE l.\`_parent_id\` = \`_posts_v\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(
    sql`UPDATE \`_posts_v_locales\` SET \`version__status\` = (SELECT \`version__status\` FROM \`_posts_v\` WHERE \`_posts_v\`.\`id\` = \`_posts_v_locales\`.\`_parent_id\`);`,
  )

  await db.run(sql`CREATE TABLE \`payload_jobs_stats\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`stats\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`DROP INDEX \`projects__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`projects\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`projects_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`projects_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE INDEX \`projects__status_idx\` ON \`projects_locales\` (\`_status\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`projects_locales_parent_id_locale_unique\` ON \`projects_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_projects_v_version_version__status_idx\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_snapshot_idx\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`version__status\`;`)
  await db.run(sql`ALTER TABLE \`_projects_v\` DROP COLUMN \`snapshot\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v_locales\` (\`version__status\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`_projects_v_locales_parent_id_locale_unique\` ON \`_projects_v_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`pages_hero_links_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_links_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_links_locales_parent_id_locale_unique\` ON \`pages_hero_links_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`pages_hero_u_s_ps_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_u_s_ps_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_u_s_ps_locales_parent_id_locale_unique\` ON \`pages_hero_u_s_ps_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`pages_hero_stats_items_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_stats_items_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_stats_items_locales_parent_id_locale_unique\` ON \`pages_hero_stats_items_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`pages_hero_tabs_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_tabs_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_tabs_locales_parent_id_locale_unique\` ON \`pages_hero_tabs_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`pages__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`pages_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`pages_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE INDEX \`pages__status_idx\` ON \`pages_locales\` (\`_status\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_locales_parent_id_locale_unique\` ON \`pages_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_links_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_links_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_links_locales_parent_id_locale_unique\` ON \`_pages_v_version_hero_links_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_u_s_ps_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_u_s_ps_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_u_s_ps_locales_parent_id_locale_unique\` ON \`_pages_v_version_hero_u_s_ps_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_stats_items_locales_locale_parent_id_u\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_stats_items_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_stats_items_locales_parent_id_locale_u\` ON \`_pages_v_version_hero_stats_items_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_tabs_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_tabs_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_tabs_locales_parent_id_locale_unique\` ON \`_pages_v_version_hero_tabs_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_version__status_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_snapshot_idx\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version__status\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`snapshot\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v_locales\` (\`version__status\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_locales_parent_id_locale_unique\` ON \`_pages_v_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`posts__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`posts_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`posts_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE INDEX \`posts__status_idx\` ON \`posts_locales\` (\`_status\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`posts_locales_parent_id_locale_unique\` ON \`posts_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_posts_v_version_version__status_idx\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_snapshot_idx\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version__status\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`snapshot\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v_locales\` (\`version__status\`,\`_locale\`);`,
  )
  await db.run(
    sql`CREATE UNIQUE INDEX \`_posts_v_locales_parent_id_locale_unique\` ON \`_posts_v_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`media_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`media_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`media_locales_parent_id_locale_unique\` ON \`media_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_checkbox_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_checkbox_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_checkbox_locales_parent_id_locale_unique\` ON \`forms_blocks_checkbox_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_country_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_country_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_country_locales_parent_id_locale_unique\` ON \`forms_blocks_country_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_email_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_email_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_email_locales_parent_id_locale_unique\` ON \`forms_blocks_email_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_message_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_message_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_message_locales_parent_id_locale_unique\` ON \`forms_blocks_message_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_number_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_number_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_number_locales_parent_id_locale_unique\` ON \`forms_blocks_number_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_select_options_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_select_options_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_options_locales_parent_id_locale_unique\` ON \`forms_blocks_select_options_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_select_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_select_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_locales_parent_id_locale_unique\` ON \`forms_blocks_select_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_state_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_state_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_state_locales_parent_id_locale_unique\` ON \`forms_blocks_state_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_text_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_text_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_text_locales_parent_id_locale_unique\` ON \`forms_blocks_text_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_textarea_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_textarea_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_textarea_locales_parent_id_locale_unique\` ON \`forms_blocks_textarea_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_telephone_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_telephone_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_telephone_locales_parent_id_locale_unique\` ON \`forms_blocks_telephone_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_emails_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_emails_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_emails_locales_parent_id_locale_unique\` ON \`forms_emails_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`forms_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_locales_parent_id_locale_unique\` ON \`forms_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`search_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`search_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`search_locales_parent_id_locale_unique\` ON \`search_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`payload_jobs_processing_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` ADD \`meta\` text;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` ADD \`processing_until\` text;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` ADD \`processing_token\` text;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` ADD \`concurrency_key\` text;`)
  await db.run(
    sql`CREATE INDEX \`payload_jobs_processing_until_idx\` ON \`payload_jobs\` (\`processing_until\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_concurrency_key_idx\` ON \`payload_jobs\` (\`concurrency_key\`);`,
  )
  await db.run(sql`ALTER TABLE \`payload_jobs\` DROP COLUMN \`processing\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_sub_subitems_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_sub_subitems_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_sub_subitems_locales_parent_id_locale_unique\` ON \`header_blocks_sub_subitems_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_sub_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_sub_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_sub_locales_parent_id_locale_unique\` ON \`header_blocks_sub_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_link_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_link_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_link_locales_parent_id_locale_unique\` ON \`header_blocks_link_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_featured_banner_locales_locale_parent_id_uniqu\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_featured_banner_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_featured_banner_locales_parent_id_locale_uniqu\` ON \`header_blocks_featured_banner_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_items_locales_locale_parent_id_u\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_items_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_category_grid_items_locales_parent_id_locale_u\` ON \`header_blocks_category_grid_items_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_category_grid_locales_parent_id_locale_unique\` ON \`header_blocks_category_grid_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_links_locales_locale_parent_id\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_links_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_cards_links_locales_parent_id_locale\` ON \`header_blocks_card_grid_cards_links_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_locales_locale_parent_id_uniqu\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_cards_locales_parent_id_locale_uniqu\` ON \`header_blocks_card_grid_cards_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_locales_parent_id_locale_unique\` ON \`header_blocks_card_grid_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_features_locales_locale_parent_id\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_features_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_feature_list_features_locales_parent_id_locale\` ON \`header_blocks_feature_list_features_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_feature_list_locales_parent_id_locale_unique\` ON \`header_blocks_feature_list_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_links_locales_locale_parent_id_un\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_links_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_simple_links_links_locales_parent_id_locale_un\` ON \`header_blocks_simple_links_links_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_simple_links_locales_parent_id_locale_unique\` ON \`header_blocks_simple_links_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_featured_image_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_featured_image_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_featured_image_locales_parent_id_locale_unique\` ON \`header_blocks_featured_image_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_submenu_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_submenu_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_submenu_locales_parent_id_locale_unique\` ON \`header_blocks_submenu_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_buttons_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_buttons_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_buttons_locales_parent_id_locale_unique\` ON \`header_buttons_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`header_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`header_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_locales_parent_id_locale_unique\` ON \`header_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_legal_links_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`footer_legal_links_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_legal_links_locales_parent_id_locale_unique\` ON \`footer_legal_links_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_social_links_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`footer_social_links_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_social_links_locales_parent_id_locale_unique\` ON \`footer_social_links_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_nav_items_sub_nav_items_locales_locale_parent_id_uniq\`;`)
  await db.run(sql`DROP INDEX \`footer_nav_items_sub_nav_items_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_nav_items_sub_nav_items_locales_parent_id_locale_uniq\` ON \`footer_nav_items_sub_nav_items_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_nav_items_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`footer_nav_items_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_nav_items_locales_parent_id_locale_unique\` ON \`footer_nav_items_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`footer_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_locales_parent_id_locale_unique\` ON \`footer_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`page_config_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`page_config_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`page_config_locales_parent_id_locale_unique\` ON \`page_config_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`DROP INDEX \`_page_config_v_locales_locale_parent_id_unique\`;`)
  await db.run(sql`DROP INDEX \`_page_config_v_locales_parent_id_idx\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_page_config_v_locales_parent_id_locale_unique\` ON \`_page_config_v_locales\` (\`_parent_id\`,\`_locale\`);`,
  )
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_jobs_log\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`executed_at\` text NOT NULL,
  	\`completed_at\` text NOT NULL,
  	\`task_slug\` text NOT NULL,
  	\`task_i_d\` text NOT NULL,
  	\`input\` text NOT NULL,
  	\`output\` text,
  	\`state\` text NOT NULL,
  	\`error\` text,
  	\`parent_task_slug\` text,
  	\`parent_task_i_d\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`payload_jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  // Task log input is required in Payload 4; older rows without one get an empty object.
  // The parent task columns are new, so the old table has nothing to copy into them.
  await db.run(
    sql`INSERT INTO \`__new_payload_jobs_log\`("_order", "_parent_id", "id", "executed_at", "completed_at", "task_slug", "task_i_d", "input", "output", "state", "error", "parent_task_slug", "parent_task_i_d") SELECT "_order", "_parent_id", "id", "executed_at", "completed_at", "task_slug", "task_i_d", COALESCE("input", '{}'), "output", "state", "error", NULL, NULL FROM \`payload_jobs_log\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_jobs_log\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_jobs_log\` RENAME TO \`payload_jobs_log\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`payload_jobs_log_order_idx\` ON \`payload_jobs_log\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_log_parent_id_idx\` ON \`payload_jobs_log\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`media\` ADD \`prefix\` text DEFAULT '';`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original_filename\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original_url\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original_mime_type\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original_filesize\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original_width\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original_height\` numeric;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original_prefix\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`original__objectkey\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_thumbnail_prefix\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_thumbnail__objectkey\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_avatar_prefix\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_avatar__objectkey\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_card_prefix\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_card__objectkey\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_og_prefix\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`variants_og__objectkey\` text;`)
  await db.run(
    sql`CREATE INDEX \`media_original_original_filename_idx\` ON \`media\` (\`original_filename\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Reverse of the status copy in up(): restore the single _status columns from 'en'.
  await db.run(sql`ALTER TABLE \`projects\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(
    sql`UPDATE \`projects\` SET \`_status\` = (SELECT l.\`_status\` FROM \`projects_locales\` l WHERE l.\`_parent_id\` = \`projects\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`version__status\` text DEFAULT 'draft';`)
  await db.run(
    sql`UPDATE \`_projects_v\` SET \`version__status\` = (SELECT l.\`version__status\` FROM \`_projects_v_locales\` l WHERE l.\`_parent_id\` = \`_projects_v\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(sql`ALTER TABLE \`pages\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(
    sql`UPDATE \`pages\` SET \`_status\` = (SELECT l.\`_status\` FROM \`pages_locales\` l WHERE l.\`_parent_id\` = \`pages\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version__status\` text DEFAULT 'draft';`)
  await db.run(
    sql`UPDATE \`_pages_v\` SET \`version__status\` = (SELECT l.\`version__status\` FROM \`_pages_v_locales\` l WHERE l.\`_parent_id\` = \`_pages_v\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(sql`ALTER TABLE \`posts\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(
    sql`UPDATE \`posts\` SET \`_status\` = (SELECT l.\`_status\` FROM \`posts_locales\` l WHERE l.\`_parent_id\` = \`posts\`.\`id\` AND l.\`_locale\` = 'en');`,
  )
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version__status\` text DEFAULT 'draft';`)
  await db.run(
    sql`UPDATE \`_posts_v\` SET \`version__status\` = (SELECT l.\`version__status\` FROM \`_posts_v_locales\` l WHERE l.\`_parent_id\` = \`_posts_v\`.\`id\` AND l.\`_locale\` = 'en');`,
  )

  await db.run(sql`DROP TABLE \`payload_jobs_stats\`;`)
  await db.run(sql`DROP INDEX \`projects__status_idx\`;`)
  await db.run(sql`DROP INDEX \`projects_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`projects_locales_locale_parent_id_unique\` ON \`projects_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`projects_locales_parent_id_idx\` ON \`projects_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`projects_locales\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_version_version__status_idx\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_projects_v_locales_locale_parent_id_unique\` ON \`_projects_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_locales_parent_id_idx\` ON \`_projects_v_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_projects_v_locales\` DROP COLUMN \`version__status\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_links_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_links_locales_locale_parent_id_unique\` ON \`pages_hero_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_links_locales_parent_id_idx\` ON \`pages_hero_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`pages_hero_u_s_ps_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_u_s_ps_locales_locale_parent_id_unique\` ON \`pages_hero_u_s_ps_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_u_s_ps_locales_parent_id_idx\` ON \`pages_hero_u_s_ps_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`pages_hero_stats_items_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_stats_items_locales_locale_parent_id_unique\` ON \`pages_hero_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_stats_items_locales_parent_id_idx\` ON \`pages_hero_stats_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`pages_hero_tabs_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_hero_tabs_locales_locale_parent_id_unique\` ON \`pages_hero_tabs_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_tabs_locales_parent_id_idx\` ON \`pages_hero_tabs_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`pages__status_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`pages_locales_locale_parent_id_unique\` ON \`pages_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_locales_parent_id_idx\` ON \`pages_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`pages_locales\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_links_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_links_locales_locale_parent_id_unique\` ON \`_pages_v_version_hero_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_links_locales_parent_id_idx\` ON \`_pages_v_version_hero_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_u_s_ps_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_u_s_ps_locales_locale_parent_id_unique\` ON \`_pages_v_version_hero_u_s_ps_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_u_s_ps_locales_parent_id_idx\` ON \`_pages_v_version_hero_u_s_ps_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_stats_items_locales_parent_id_locale_u\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_stats_items_locales_locale_parent_id_u\` ON \`_pages_v_version_hero_stats_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_stats_items_locales_parent_id_idx\` ON \`_pages_v_version_hero_stats_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_tabs_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_version_hero_tabs_locales_locale_parent_id_unique\` ON \`_pages_v_version_hero_tabs_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_tabs_locales_parent_id_idx\` ON \`_pages_v_version_hero_tabs_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`_pages_v_version_version__status_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_pages_v_locales_locale_parent_id_unique\` ON \`_pages_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_locales_parent_id_idx\` ON \`_pages_v_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_pages_v_locales\` DROP COLUMN \`version__status\`;`)
  await db.run(sql`DROP INDEX \`posts__status_idx\`;`)
  await db.run(sql`DROP INDEX \`posts_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`posts_locales_locale_parent_id_unique\` ON \`posts_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`posts_locales_parent_id_idx\` ON \`posts_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`posts_locales\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_version_version__status_idx\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_posts_v_locales_locale_parent_id_unique\` ON \`_posts_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_locales_parent_id_idx\` ON \`_posts_v_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`ALTER TABLE \`_posts_v_locales\` DROP COLUMN \`version__status\`;`)
  await db.run(sql`DROP INDEX \`media_original_original_filename_idx\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`prefix\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original_filename\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original_url\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original_mime_type\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original_filesize\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original_width\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original_height\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original_prefix\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`original__objectkey\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_thumbnail_prefix\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_thumbnail__objectkey\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_avatar_prefix\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_avatar__objectkey\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_card_prefix\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_card__objectkey\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_og_prefix\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`variants_og__objectkey\`;`)
  await db.run(sql`DROP INDEX \`media_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`media_locales_parent_id_idx\` ON \`media_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_checkbox_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_checkbox_locales_locale_parent_id_unique\` ON \`forms_blocks_checkbox_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_checkbox_locales_parent_id_idx\` ON \`forms_blocks_checkbox_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_country_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_country_locales_locale_parent_id_unique\` ON \`forms_blocks_country_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_country_locales_parent_id_idx\` ON \`forms_blocks_country_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_email_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_email_locales_locale_parent_id_unique\` ON \`forms_blocks_email_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_email_locales_parent_id_idx\` ON \`forms_blocks_email_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_message_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_message_locales_locale_parent_id_unique\` ON \`forms_blocks_message_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_message_locales_parent_id_idx\` ON \`forms_blocks_message_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_number_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_number_locales_locale_parent_id_unique\` ON \`forms_blocks_number_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_number_locales_parent_id_idx\` ON \`forms_blocks_number_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_select_options_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_options_locales_locale_parent_id_unique\` ON \`forms_blocks_select_options_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_options_locales_parent_id_idx\` ON \`forms_blocks_select_options_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_select_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_select_locales_locale_parent_id_unique\` ON \`forms_blocks_select_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_locales_parent_id_idx\` ON \`forms_blocks_select_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_state_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_state_locales_locale_parent_id_unique\` ON \`forms_blocks_state_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_state_locales_parent_id_idx\` ON \`forms_blocks_state_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_text_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_text_locales_locale_parent_id_unique\` ON \`forms_blocks_text_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_text_locales_parent_id_idx\` ON \`forms_blocks_text_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_textarea_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_textarea_locales_locale_parent_id_unique\` ON \`forms_blocks_textarea_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_textarea_locales_parent_id_idx\` ON \`forms_blocks_textarea_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_blocks_telephone_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_blocks_telephone_locales_locale_parent_id_unique\` ON \`forms_blocks_telephone_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_telephone_locales_parent_id_idx\` ON \`forms_blocks_telephone_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_emails_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_emails_locales_locale_parent_id_unique\` ON \`forms_emails_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_emails_locales_parent_id_idx\` ON \`forms_emails_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`forms_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`forms_locales_locale_parent_id_unique\` ON \`forms_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_locales_parent_id_idx\` ON \`forms_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`search_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`search_locales_locale_parent_id_unique\` ON \`search_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`search_locales_parent_id_idx\` ON \`search_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`payload_jobs_processing_until_idx\`;`)
  await db.run(sql`DROP INDEX \`payload_jobs_concurrency_key_idx\`;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` ADD \`processing\` integer DEFAULT false;`)
  await db.run(
    sql`CREATE INDEX \`payload_jobs_processing_idx\` ON \`payload_jobs\` (\`processing\`);`,
  )
  await db.run(sql`ALTER TABLE \`payload_jobs\` DROP COLUMN \`meta\`;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` DROP COLUMN \`processing_until\`;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` DROP COLUMN \`processing_token\`;`)
  await db.run(sql`ALTER TABLE \`payload_jobs\` DROP COLUMN \`concurrency_key\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_sub_subitems_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_sub_subitems_locales_locale_parent_id_unique\` ON \`header_blocks_sub_subitems_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_subitems_locales_parent_id_idx\` ON \`header_blocks_sub_subitems_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_sub_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_sub_locales_locale_parent_id_unique\` ON \`header_blocks_sub_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_locales_parent_id_idx\` ON \`header_blocks_sub_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_link_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_link_locales_locale_parent_id_unique\` ON \`header_blocks_link_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_link_locales_parent_id_idx\` ON \`header_blocks_link_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_featured_banner_locales_parent_id_locale_uniqu\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_featured_banner_locales_locale_parent_id_uniqu\` ON \`header_blocks_featured_banner_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_banner_locales_parent_id_idx\` ON \`header_blocks_featured_banner_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_items_locales_parent_id_locale_u\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_category_grid_items_locales_locale_parent_id_u\` ON \`header_blocks_category_grid_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_items_locales_parent_id_idx\` ON \`header_blocks_category_grid_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_category_grid_locales_locale_parent_id_unique\` ON \`header_blocks_category_grid_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_locales_parent_id_idx\` ON \`header_blocks_category_grid_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_links_locales_parent_id_locale\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_cards_links_locales_locale_parent_id\` ON \`header_blocks_card_grid_cards_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_links_locales_parent_id_idx\` ON \`header_blocks_card_grid_cards_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_locales_parent_id_locale_uniqu\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_cards_locales_locale_parent_id_uniqu\` ON \`header_blocks_card_grid_cards_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_locales_parent_id_idx\` ON \`header_blocks_card_grid_cards_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_card_grid_locales_locale_parent_id_unique\` ON \`header_blocks_card_grid_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_locales_parent_id_idx\` ON \`header_blocks_card_grid_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_features_locales_parent_id_locale\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_feature_list_features_locales_locale_parent_id\` ON \`header_blocks_feature_list_features_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_features_locales_parent_id_idx\` ON \`header_blocks_feature_list_features_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_feature_list_locales_locale_parent_id_unique\` ON \`header_blocks_feature_list_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_locales_parent_id_idx\` ON \`header_blocks_feature_list_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_links_locales_parent_id_locale_un\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_simple_links_links_locales_locale_parent_id_un\` ON \`header_blocks_simple_links_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_links_locales_parent_id_idx\` ON \`header_blocks_simple_links_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_simple_links_locales_locale_parent_id_unique\` ON \`header_blocks_simple_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_locales_parent_id_idx\` ON \`header_blocks_simple_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_featured_image_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_featured_image_locales_locale_parent_id_unique\` ON \`header_blocks_featured_image_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_image_locales_parent_id_idx\` ON \`header_blocks_featured_image_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_blocks_submenu_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_blocks_submenu_locales_locale_parent_id_unique\` ON \`header_blocks_submenu_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_submenu_locales_parent_id_idx\` ON \`header_blocks_submenu_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_buttons_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_buttons_locales_locale_parent_id_unique\` ON \`header_buttons_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_buttons_locales_parent_id_idx\` ON \`header_buttons_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`header_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`header_locales_locale_parent_id_unique\` ON \`header_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_locales_parent_id_idx\` ON \`header_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_legal_links_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_legal_links_locales_locale_parent_id_unique\` ON \`footer_legal_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_legal_links_locales_parent_id_idx\` ON \`footer_legal_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_social_links_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_social_links_locales_locale_parent_id_unique\` ON \`footer_social_links_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_social_links_locales_parent_id_idx\` ON \`footer_social_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_nav_items_sub_nav_items_locales_parent_id_locale_uniq\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_nav_items_sub_nav_items_locales_locale_parent_id_uniq\` ON \`footer_nav_items_sub_nav_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_sub_nav_items_locales_parent_id_idx\` ON \`footer_nav_items_sub_nav_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_nav_items_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_nav_items_locales_locale_parent_id_unique\` ON \`footer_nav_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_locales_parent_id_idx\` ON \`footer_nav_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`footer_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`footer_locales_locale_parent_id_unique\` ON \`footer_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_locales_parent_id_idx\` ON \`footer_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`page_config_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`page_config_locales_locale_parent_id_unique\` ON \`page_config_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`page_config_locales_parent_id_idx\` ON \`page_config_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`DROP INDEX \`_page_config_v_locales_parent_id_locale_unique\`;`)
  await db.run(
    sql`CREATE UNIQUE INDEX \`_page_config_v_locales_locale_parent_id_unique\` ON \`_page_config_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_page_config_v_locales_parent_id_idx\` ON \`_page_config_v_locales\` (\`_parent_id\`);`,
  )
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_jobs_log\` (
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
    sql`INSERT INTO \`__new_payload_jobs_log\`("_order", "_parent_id", "id", "executed_at", "completed_at", "task_slug", "task_i_d", "input", "output", "state", "error") SELECT "_order", "_parent_id", "id", "executed_at", "completed_at", "task_slug", "task_i_d", "input", "output", "state", "error" FROM \`payload_jobs_log\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_jobs_log\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_jobs_log\` RENAME TO \`payload_jobs_log\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`payload_jobs_log_order_idx\` ON \`payload_jobs_log\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_jobs_log_parent_id_idx\` ON \`payload_jobs_log\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`projects__status_idx\` ON \`projects\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`_projects_v\` ADD \`snapshot\` integer;`)
  await db.run(
    sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_projects_v_snapshot_idx\` ON \`_projects_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`snapshot\` integer;`)
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_pages_v_snapshot_idx\` ON \`_pages_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`snapshot\` integer;`)
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`,
  )
  await db.run(sql`CREATE INDEX \`_posts_v_snapshot_idx\` ON \`_posts_v\` (\`snapshot\`);`)
}
