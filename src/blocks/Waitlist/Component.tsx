import React from 'react'
import { WaitlistDesignVersion } from './config'
import Waitlist1 from '@/blocks/Waitlist/waitlist1'
import Waitlist2 from '@/blocks/Waitlist/waitlist2'
import Waitlist3 from '@/blocks/Waitlist/waitlist3'
import { RenderBlocks } from '@/blocks/RenderBlocks'

type Waitlist<T extends string = string> = Required<Record<WaitlistDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const waitlist: Waitlist = {
  WAITLIST1: Waitlist1,
  WAITLIST2: Waitlist2,
  WAITLIST3: Waitlist3,
}

export const WaitlistBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'waitlist') return null

  const { designVersion, form, publicContext } = props || {}

  if (!designVersion) return null

  const WaitlistToRender = waitlist[designVersion as WaitlistDesignVersion]

  if (!WaitlistToRender) return null

  // Pre-render the form server-side so client variants (e.g. waitlist2) don't
  // need to import RenderBlocks, which would pull @payload-config into the
  // client bundle through the static import chain.
  const renderedForm =
    form && form[0]?.form ? (
      <RenderBlocks blocks={form} publicContext={publicContext} disableContainer />
    ) : null

  return <WaitlistToRender {...props} renderedForm={renderedForm} />
}

export default WaitlistBlock
