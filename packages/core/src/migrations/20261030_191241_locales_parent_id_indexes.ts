import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`CREATE INDEX \`projects_locales_parent_id_idx\` ON \`projects_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_projects_v_locales_parent_id_idx\` ON \`_projects_v_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_links_locales_parent_id_idx\` ON \`pages_hero_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_u_s_ps_locales_parent_id_idx\` ON \`pages_hero_u_s_ps_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_stats_items_locales_parent_id_idx\` ON \`pages_hero_stats_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_hero_tabs_locales_parent_id_idx\` ON \`pages_hero_tabs_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`pages_locales_parent_id_idx\` ON \`pages_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_links_locales_parent_id_idx\` ON \`_pages_v_version_hero_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_u_s_ps_locales_parent_id_idx\` ON \`_pages_v_version_hero_u_s_ps_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_stats_items_locales_parent_id_idx\` ON \`_pages_v_version_hero_stats_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_version_hero_tabs_locales_parent_id_idx\` ON \`_pages_v_version_hero_tabs_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_pages_v_locales_parent_id_idx\` ON \`_pages_v_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`posts_locales_parent_id_idx\` ON \`posts_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_posts_v_locales_parent_id_idx\` ON \`_posts_v_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`media_locales_parent_id_idx\` ON \`media_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_checkbox_locales_parent_id_idx\` ON \`forms_blocks_checkbox_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_country_locales_parent_id_idx\` ON \`forms_blocks_country_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_email_locales_parent_id_idx\` ON \`forms_blocks_email_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_message_locales_parent_id_idx\` ON \`forms_blocks_message_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_number_locales_parent_id_idx\` ON \`forms_blocks_number_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_options_locales_parent_id_idx\` ON \`forms_blocks_select_options_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_select_locales_parent_id_idx\` ON \`forms_blocks_select_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_state_locales_parent_id_idx\` ON \`forms_blocks_state_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_text_locales_parent_id_idx\` ON \`forms_blocks_text_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_textarea_locales_parent_id_idx\` ON \`forms_blocks_textarea_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_blocks_telephone_locales_parent_id_idx\` ON \`forms_blocks_telephone_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_emails_locales_parent_id_idx\` ON \`forms_emails_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_locales_parent_id_idx\` ON \`forms_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`search_locales_parent_id_idx\` ON \`search_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_subitems_locales_parent_id_idx\` ON \`header_blocks_sub_subitems_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_sub_locales_parent_id_idx\` ON \`header_blocks_sub_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_link_locales_parent_id_idx\` ON \`header_blocks_link_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_banner_locales_parent_id_idx\` ON \`header_blocks_featured_banner_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_items_locales_parent_id_idx\` ON \`header_blocks_category_grid_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_category_grid_locales_parent_id_idx\` ON \`header_blocks_category_grid_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_links_locales_parent_id_idx\` ON \`header_blocks_card_grid_cards_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_cards_locales_parent_id_idx\` ON \`header_blocks_card_grid_cards_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_card_grid_locales_parent_id_idx\` ON \`header_blocks_card_grid_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_features_locales_parent_id_idx\` ON \`header_blocks_feature_list_features_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_feature_list_locales_parent_id_idx\` ON \`header_blocks_feature_list_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_links_locales_parent_id_idx\` ON \`header_blocks_simple_links_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_simple_links_locales_parent_id_idx\` ON \`header_blocks_simple_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_featured_image_locales_parent_id_idx\` ON \`header_blocks_featured_image_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_blocks_submenu_locales_parent_id_idx\` ON \`header_blocks_submenu_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_buttons_locales_parent_id_idx\` ON \`header_buttons_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`header_locales_parent_id_idx\` ON \`header_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_legal_links_locales_parent_id_idx\` ON \`footer_legal_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_social_links_locales_parent_id_idx\` ON \`footer_social_links_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_sub_nav_items_locales_parent_id_idx\` ON \`footer_nav_items_sub_nav_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_nav_items_locales_parent_id_idx\` ON \`footer_nav_items_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`footer_locales_parent_id_idx\` ON \`footer_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`page_config_locales_parent_id_idx\` ON \`page_config_locales\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`_page_config_v_locales_parent_id_idx\` ON \`_page_config_v_locales\` (\`_parent_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`projects_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_projects_v_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_links_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_u_s_ps_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_stats_items_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_hero_tabs_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`pages_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_links_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_u_s_ps_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_stats_items_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_version_hero_tabs_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_pages_v_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`posts_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_posts_v_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`media_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_checkbox_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_country_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_email_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_message_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_number_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_select_options_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_select_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_state_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_text_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_textarea_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_blocks_telephone_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_emails_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`forms_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`search_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_sub_subitems_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_sub_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_link_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_featured_banner_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_items_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_category_grid_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_links_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_cards_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_card_grid_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_features_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_feature_list_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_links_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_simple_links_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_featured_image_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_blocks_submenu_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_buttons_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`header_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_legal_links_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_social_links_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_nav_items_sub_nav_items_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_nav_items_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`footer_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`page_config_locales_parent_id_idx\`;`)
  await db.run(sql`DROP INDEX \`_page_config_v_locales_parent_id_idx\`;`)
}
