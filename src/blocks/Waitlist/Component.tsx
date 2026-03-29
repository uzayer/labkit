import { WaitlistDesignVersion } from './config'
import Waitlist1 from '@/blocks/Waitlist/waitlist1'
import Waitlist2 from '@/blocks/Waitlist/waitlist2'
import Waitlist3 from '@/blocks/Waitlist/waitlist3'

type Waitlist<T extends string = string> = Required<Record<WaitlistDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const waitlist: Waitlist = {
  WAITLIST1: Waitlist1,
  WAITLIST2: Waitlist2,
  WAITLIST3: Waitlist3,
}

export const WaitlistBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'waitlist') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const WaitlistToRender = waitlist[designVersion as WaitlistDesignVersion]

  if (!WaitlistToRender) return null

  return <WaitlistToRender {...props} />
}

export default WaitlistBlock
