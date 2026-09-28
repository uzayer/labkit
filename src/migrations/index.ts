import * as migration_20260923_202012_initial_sqlite from './20260923_202012_initial_sqlite'
import * as migration_20260928_174313_media_object_key from './20260928_174313_media_object_key'

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
]
