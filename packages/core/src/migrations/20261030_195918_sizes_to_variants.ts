import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-sqlite'
import { migrateSizesToVariants } from '@payloadcms/db-sqlite/migration-utils'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await migrateSizesToVariants({ db, payload })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await migrateSizesToVariants({ db, direction: 'down', payload })
}
