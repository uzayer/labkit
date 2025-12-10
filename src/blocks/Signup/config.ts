import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { Block } from 'payload'

export const allSignupDesignVersions = [
  {
    label: 'SIGNUP4',
    value: 'SIGNUP4',
    image: '/admin/previews/signup/signup4.webp',
  },
] as const

export type SignupDesignVersion = (typeof allSignupDesignVersions)[number]

export const SignupBlock: Block = {
  slug: 'signup',
  interfaceName: 'SignupBlock',
  labels: {
    singular: 'Signup',
    plural: 'multiple Signups',
  },
  fields: [
    designVersionPreview(allSignupDesignVersions),
    // should google signup be enabled (default yes)
    {
      name: 'googleSignupEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: {
        de: 'Google Anmeldung erlauben',
        en: 'Allow Google signup',
      },
    },
    // should facebook signup be enabled (default no)
    {
      name: 'facebookSignupEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: {
        de: 'Facebook Anmeldung erlauben',
        en: 'Allow Facebook signup',
      },
    },
    // should apple signup be enabled (default no)
    {
      name: 'appleSignupEnabled',
      type: 'checkbox',
      defaultValue: false,
      label: {
        de: 'Apple Anmeldung erlauben',
        en: 'Allow Apple signup',
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
      defaultValue: 'Signup',
    },
    {
      name: 'subheading',
      type: 'text',
      label: {
        de: 'Unterüberschrift',
        en: 'Subheading',
      },
      defaultValue: 'Create a new account',
    },
    {
      name: 'signupText',
      type: 'text',
      label: {
        de: 'Anmelde-Text',
        en: 'Signup Text',
      },
      defaultValue: 'Create an account',
    },
    {
      name: 'loginText',
      type: 'text',
      label: {
        de: 'Login-Text',
        en: 'Login Text',
      },
      defaultValue: 'Already have an account?',
    },
    {
      name: 'googleText',
      type: 'text',
      label: {
        de: 'Google-Text',
        en: 'Google Text',
      },
      defaultValue: 'Sign up with Google',
    },
    {
      name: 'facebookText',
      type: 'text',
      label: {
        de: 'Facebook-Text',
        en: 'Facebook Text',
      },
      defaultValue: 'Sign up with Facebook',
    },
    {
      name: 'appleText',
      type: 'text',
      label: {
        de: 'Apple-Text',
        en: 'Apple Text',
      },
      defaultValue: 'Sign up with Apple',
    },
  ],
}
