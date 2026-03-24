import React from 'react'
import { AwardsDesignVersion } from './config'
import Awards2 from './awards2'
import Awards3 from './awards3'
import Awards4 from './awards4'

type AwardsVersionValue = AwardsDesignVersion

type Awards<T extends string = string> = Required<Record<AwardsVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

const awards: Awards = {
  AWARDS2: Awards2,
  AWARDS3: Awards3,
  AWARDS4: Awards4,
}

export const AwardsBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'awards') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const AwardsToRender = awards[designVersion as AwardsVersionValue]

  if (!AwardsToRender) return null

  return <AwardsToRender {...props} />
}

export default AwardsBlock
