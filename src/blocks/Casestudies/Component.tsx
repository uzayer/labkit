import { CasestudiesDesignVersion } from './config'
import Casestudies1 from './casestudies1'
import Casestudies2 from './casestudies2'
import Casestudies3 from './casestudies3'
import Casestudies4 from './casestudies4'
import { Casestudies5 } from './casestudies5'

type CasestudiesVersionValue = CasestudiesDesignVersion

type Casestudies<T extends string = string> = Required<
  Record<CasestudiesVersionValue, React.FC<any>>
> &
  Record<T, React.FC<any>>

const casestudies: Casestudies = {
  CASESTUDIES1: Casestudies1,
  CASESTUDIES2: Casestudies2,
  CASESTUDIES3: Casestudies3,
  CASESTUDIES4: Casestudies4,
  CASESTUDIES5: Casestudies5,
}

export const CasestudiesBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'casestudies') return null
  if (!designVersion) return null

  const CasestudiesToRender = casestudies[designVersion as CasestudiesVersionValue]

  if (!CasestudiesToRender) return null

  return <CasestudiesToRender {...props} />
}

export default CasestudiesBlock
