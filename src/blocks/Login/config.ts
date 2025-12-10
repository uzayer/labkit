import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { Block } from 'payload'
import { SignupBlock } from '@/blocks/Signup/config'

export const allLoginDesignVersions = [
  {
    label: 'LOGIN3',
    value: 'LOGIN3',
    image: '/admin/previews/login/login3.webp',
  },
] as const

export type LoginDesignVersion = (typeof allLoginDesignVersions)[number]

export const LoginBlock: Block = {
  slug: 'login',
  interfaceName: 'LoginBlock',
  labels: {
    singular: 'Login',
    plural: 'multiple Logins',
  },
  fields: [
    designVersionPreview(allLoginDesignVersions),
    // should signup be enabled (default yes)
    {
      name: 'signupEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: {
        de: 'Anmeldung erlauben',
        en: 'Allow signup',
      },
    },
    // Reference to a signup block when signup is enabled
    {
      name: 'signupBlock',
      type: 'blocks',
      blocks: [SignupBlock],
      maxRows: 1,
      admin: {
        condition: (_, { signupEnabled } = { signupEnabled: false }) => Boolean(signupEnabled),
        description: 'Select a signup form to use',
      },
      label: {
        de: 'Anmeldeseite',
        en: 'Signup Page',
      },
    },
    // should google login be enabled (default yes)
    {
      name: 'googleLoginEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: {
        de: 'Google Login erlauben',
        en: 'Allow Google login',
      },
    },
    // should facebook login be enabled (default no)
    {
      name: 'facebookLoginEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: {
        de: 'Facebook Login erlauben',
        en: 'Allow Facebook login',
      },
    },
    // should apple login be enabled (default no)
    {
      name: 'appleLoginEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: {
        de: 'Apple Login erlauben',
        en: 'Allow Apple login',
      },
    },
    // Customization options
    {
      name: 'heading',
      type: 'text',
      label: {
        de: 'Überschrift',
        en: 'Heading',
      },
      defaultValue: 'Login',
    },
    {
      name: 'subheading',
      type: 'text',
      label: {
        de: 'Unterüberschrift',
        en: 'Subheading',
      },
      defaultValue: 'Welcome back',
    },
    {
      name: 'loginText',
      type: 'text',
      label: {
        de: 'Login-Text',
        en: 'Login Text',
      },
      defaultValue: 'Log in',
    },
    {
      name: 'googleText',
      type: 'text',
      label: {
        de: 'Google-Text',
        en: 'Google Text',
      },
      defaultValue: 'Log in with Google',
    },
    {
      name: 'dontHaveAccountText',
      type: 'text',
      label: {
        de: 'Kein Konto Text',
        en: 'No Account Text',
      },
      defaultValue: "Don't have an account?",
    },
  ],
}
