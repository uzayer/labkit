import { Signup4 } from '@/blocks/Signup/Signup4'
import { SignupDesignVersion } from './config'
import { Page } from '@/payload-types'

// Extract just the value property from SignupDesignVersion for use as keys
type SignupDesignVersionValue = SignupDesignVersion['value']

// Enforce required features but allow additional ones
type Signup<T extends string = string> = Required<Record<SignupDesignVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

const signups: Signup = {
  SIGNUP4: Signup4,
}

export const SignupBlock = <T extends object = {}>(props: Page['layout'][0] & T) => {
  if (props.blockType !== 'signup') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const SignupToRender = signups[designVersion]

  if (!SignupToRender) return null

  return <SignupToRender {...props} />
}
