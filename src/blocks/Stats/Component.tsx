import { StatDesignVersion } from './config'
import Stats1 from '@/blocks/Stats/stats1'
import Stats2 from '@/blocks/Stats/stats2'
import Stats4 from '@/blocks/Stats/stats4'
import Stats5 from '@/blocks/Stats/stats5'
import Stats6 from '@/blocks/Stats/stats6'
import Stats7 from '@/blocks/Stats/stats7'
import Stats8 from '@/blocks/Stats/stats8'
import Stats10 from '@/blocks/Stats/stats10'

type Stats<T extends string = string> = Required<Record<StatDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const stats: Stats = {
  STATS1: Stats1,
  STATS2: Stats2,
  STATS4: Stats4,
  STATS5: Stats5,
  STATS6: Stats6,
  STATS7: Stats7,
  STATS8: Stats8,
  STATS10: Stats10,
}

export const StatsBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'stats') return null
  if (!designVersion) return null

  const StatsToRender = stats[designVersion as StatDesignVersion]

  if (!StatsToRender) return null

  return <StatsToRender {...props} />
}

export default StatsBlock
