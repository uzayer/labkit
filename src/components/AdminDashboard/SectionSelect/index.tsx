import * as React from 'react'
import SectionSelectClient from './index.client'
import type { FieldServerComponent } from 'payload'
import type { TextField } from 'payload'

const SectionSelect: FieldServerComponent<TextField> = ({ path, siblingData, relationTo }) => {
  const relationto = siblingData?.reference?.relationTo || relationTo
  if (!relationto) return <></>
  return <SectionSelectClient path={path as string} relationto={relationto} />
}

export default SectionSelect
