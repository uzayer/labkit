import Logos1 from '@/blocks/Logos/logos1'
import Logos2 from '@/blocks/Logos/logos2'
import Logos3 from '@/blocks/Logos/logos3'
import Logos9 from '@/blocks/Logos/logos9'

import { LogosDesignVersion } from './config'

type LogosVersionValue = LogosDesignVersion['value']

type Logos<T extends string = string> = Required<Record<LogosVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

const Logos: Logos = {
  LOGOS1: Logos1,
  LOGOS2: Logos2,
  LOGOS3: Logos3,
  LOGOS9: Logos9,
}

export const LogosBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'logos') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const LogosToRender = Logos[designVersion as LogosVersionValue]

  if (!LogosToRender) return null

  return <LogosToRender {...props} />
}

export default LogosBlock
