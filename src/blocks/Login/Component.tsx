import { Login3 } from '@/blocks/Login/Login3'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { LoginDesignVersion } from './config'

// Extract just the value property from LoginDesignVersion for use as keys
type LoginDesignVersionValue = LoginDesignVersion['value']

// Define the Login block interface
export interface LoginBlockProps {
  blockType: 'login'
  designVersion: LoginDesignVersionValue
  signupEnabled?: boolean
  googleLoginEnabled?: boolean
  facebookLoginEnabled?: boolean
  appleLoginEnabled?: boolean
  blockName?: string
  id?: string
  publicContext?: PublicContextProps
}

// Enforce required features but allow additional ones
type Login<T extends string = string> = Required<Record<LoginDesignVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

const logins: Login = {
  LOGIN3: Login3,
}

export const LoginBlock: React.FC<LoginBlockProps> = (props) => {
  if (props.blockType !== 'login') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const LoginToRender = logins[designVersion]

  if (!LoginToRender) return null

  return <LoginToRender {...props} publicContext={props.publicContext || {}} />
}
