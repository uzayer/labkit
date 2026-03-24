import React from 'react'

import type { Page } from '@/payload-types'

import { Hero1 } from '@/heros/PageHero/hero1'
import { Hero2 } from '@/heros/PageHero/hero2'
import { Hero3 } from '@/heros/PageHero/hero3'
import { Hero4 } from '@/heros/PageHero/hero4'
import { Hero5 } from '@/heros/PageHero/hero5'
import { Hero6 } from '@/heros/PageHero/hero6'
import { Hero7 } from '@/heros/PageHero/hero7'
import { Hero8 } from '@/heros/PageHero/hero8'
import Hero9 from '@/heros/PageHero/hero9'
import Hero10 from '@/heros/PageHero/hero10'
import Hero11 from '@/heros/PageHero/hero11'
import Hero12 from '@/heros/PageHero/hero12'
import Hero13 from '@/heros/PageHero/hero13'
import Hero14 from '@/heros/PageHero/hero14'
import Hero15 from '@/heros/PageHero/hero15'
import Hero16 from '@/heros/PageHero/hero16'
import Hero18 from '@/heros/PageHero/hero18'
import Hero20 from '@/heros/PageHero/hero20'
import Hero21 from '@/heros/PageHero/hero21'
import Hero24 from '@/heros/PageHero/hero24'
import Hero25 from '@/heros/PageHero/hero25'
import Hero26 from '@/heros/PageHero/hero26'
import Hero27 from '@/heros/PageHero/hero27'
import Hero28 from '@/heros/PageHero/hero28'
import Hero29 from '@/heros/PageHero/hero29'
import Hero30 from '@/heros/PageHero/hero30'
import { Hero31 } from '@/heros/PageHero/hero31'
import Hero32 from '@/heros/PageHero/hero32'
import Hero33 from '@/heros/PageHero/hero33'
import Hero34 from '@/heros/PageHero/hero34'
import Hero35 from '@/heros/PageHero/hero35'
import Hero36 from '@/heros/PageHero/hero36'
import Hero37 from '@/heros/PageHero/hero37'
import Hero38 from '@/heros/PageHero/hero38'
import Hero39 from '@/heros/PageHero/hero39'
import Hero40 from '@/heros/PageHero/hero40'
import Hero45 from '@/heros/PageHero/hero45'
import Hero50 from '@/heros/PageHero/hero50'
import Hero51 from '@/heros/PageHero/hero51'
import Hero53 from '@/heros/PageHero/hero53'
import Hero55 from '@/heros/PageHero/hero55'
import Hero57 from '@/heros/PageHero/hero57'
import Hero101 from '@/heros/PageHero/hero101'
import Hero112 from '@/heros/PageHero/hero112'
import Hero195 from '@/heros/PageHero/hero195'
import { Hero220 } from '@/heros/PageHero/hero220'
import { Hero214 } from '@/heros/PageHero/hero214'
import { Hero219 } from '@/heros/PageHero/hero219'
import { PublicContextProps } from '@/utilities/publicContextProps'

const heroes = {
  1: Hero1,
  2: Hero2,
  3: Hero3,
  4: Hero4,
  5: Hero5,
  6: Hero6,
  7: Hero7,
  8: Hero8,
  9: Hero9,
  10: Hero10,
  11: Hero11,
  12: Hero12,
  13: Hero13,
  14: Hero14,
  15: Hero15,
  16: Hero16,
  18: Hero18,
  20: Hero20,
  21: Hero21,
  24: Hero24,
  25: Hero25,
  26: Hero26,
  27: Hero27,
  28: Hero28,
  29: Hero29,
  30: Hero30,
  31: Hero31,
  32: Hero32,
  33: Hero33,
  34: Hero34,
  35: Hero35,
  36: Hero36,
  37: Hero37,
  38: Hero38,
  39: Hero39,
  40: Hero40,
  45: Hero45,
  50: Hero50,
  51: Hero51,
  53: Hero53,
  55: Hero55,
  57: Hero57,
  101: Hero101,
  112: Hero112,
  195: Hero195,
  220: Hero220,
  214: Hero214,
  219: Hero219,
}

export const RenderHero: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = (
  props,
) => {
  const { designVersion, publicContext } = props || {}

  if (!designVersion || designVersion === 'none') return null

  const HeroToRender = heroes[designVersion]

  if (!HeroToRender) return null

  return <HeroToRender {...props} publicContext={publicContext} />
}
