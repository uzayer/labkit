import React from 'react'
import type { Page } from '@/payload-types'
import { Changelog1 } from './changelog1'
import { Changelog3 } from './changelog3'
import { Changelog4 } from './changelog4'
import { Changelog5 } from './changelog5'
import { Changelog6 } from './changelog6'
import { Changelog8 } from './changelog8'
import { PublicContextProps } from '@/utilities/publicContextProps'

const changelogs = {
  CHANGELOG1: Changelog1,
  CHANGELOG3: Changelog3,
  CHANGELOG4: Changelog4,
  CHANGELOG5: Changelog5,
  CHANGELOG6: Changelog6,
  CHANGELOG8: Changelog8,
}

export const ChangelogBlock: React.FC<Page['layout'][0] & { publicContext: PublicContextProps }> = (
  props,
) => {
  if (props.blockType !== 'changelog') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const ChangelogToRender = changelogs[designVersion]

  if (!ChangelogToRender) return null

  return <ChangelogToRender {...props} />
}
