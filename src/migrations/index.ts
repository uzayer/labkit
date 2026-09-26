import * as migration_20260923_202012_initial_sqlite from './20260923_202012_initial_sqlite'

export const migrations = [
  {
    up: migration_20260923_202012_initial_sqlite.up,
    down: migration_20260923_202012_initial_sqlite.down,
    name: '20260923_202012_initial_sqlite',
  },
]
