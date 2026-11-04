import * as migration_20260923_202012_initial_sqlite from './20260923_202012_initial_sqlite'
import * as migration_20260928_174313_media_object_key from './20260928_174313_media_object_key'
import * as migration_20261030_191241_locales_parent_id_indexes from './20261030_191241_locales_parent_id_indexes'
import * as migration_20261030_195918_sizes_to_variants from './20261030_195918_sizes_to_variants'
import * as migration_20261030_200150_payload_v4 from './20261030_200150_payload_v4'
import * as migration_20261104_145319_features_and_lab_content from './20261104_145319_features_and_lab_content'
import * as migration_20261104_154345_schema_batch from './20261104_154345_schema_batch'

export const migrations = [
  {
    up: migration_20260923_202012_initial_sqlite.up,
    down: migration_20260923_202012_initial_sqlite.down,
    name: '20260923_202012_initial_sqlite',
  },
  {
    up: migration_20260928_174313_media_object_key.up,
    down: migration_20260928_174313_media_object_key.down,
    name: '20260928_174313_media_object_key',
  },
  {
    up: migration_20261030_191241_locales_parent_id_indexes.up,
    down: migration_20261030_191241_locales_parent_id_indexes.down,
    name: '20261030_191241_locales_parent_id_indexes',
  },
  {
    up: migration_20261030_195918_sizes_to_variants.up,
    down: migration_20261030_195918_sizes_to_variants.down,
    name: '20261030_195918_sizes_to_variants',
  },
  {
    up: migration_20261030_200150_payload_v4.up,
    down: migration_20261030_200150_payload_v4.down,
    name: '20261030_200150_payload_v4',
  },
  {
    up: migration_20261104_145319_features_and_lab_content.up,
    down: migration_20261104_145319_features_and_lab_content.down,
    name: '20261104_145319_features_and_lab_content',
  },
  {
    up: migration_20261104_154345_schema_batch.up,
    down: migration_20261104_154345_schema_batch.down,
    name: '20261104_154345_schema_batch',
  },
]
