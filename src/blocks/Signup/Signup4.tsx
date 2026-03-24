'use client'

import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Signup4Props {
  setShowSignup?: (showSignup: boolean) => void
  heading?: string
  subheading?: string
  logo?: {
    url: string
    src: string
    alt: string
    title: string
  }
  signupText?: string
  googleText?: string
  facebookText?: string
  appleText?: string
  loginText?: string
  googleSignupEnabled?: boolean
  facebookSignupEnabled?: boolean
  appleSignupEnabled?: boolean
  onLoginClick?: () => void
}

const Signup4: React.FC<Signup4Props> = ({
  heading = 'Signup',
  subheading = 'Create a new account',
  logo = {
    url: 'https://www.shadcnblocks.com',
    src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg',
    alt: 'logo',
    title: 'shadcnblocks.com',
  },
  googleText = 'Sign up with Google',
  signupText = 'Create an account',
  loginText = 'Already have an account?',
  facebookText = 'Sign up with Facebook',
  appleText = 'Sign up with Apple',
  googleSignupEnabled = true,
  facebookSignupEnabled = false,
  appleSignupEnabled = false,
  onLoginClick,
  setShowSignup,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              <a href={logo.url} className="mb-6 flex items-center gap-2">
                <img src={logo.src} className="max-h-8" alt={logo.alt} />
              </a>
              <h1 className="mb-2 text-2xl font-bold">{heading}</h1>
              <p className="text-muted-foreground">{subheading}</p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="bg-background"
                />
              </div>
              <div>
                <div className="grid gap-4">
                  <Button type="submit" className="mt-2 w-full">
                    {signupText}
                  </Button>

                  {(googleSignupEnabled || facebookSignupEnabled || appleSignupEnabled) && (
                    <div className="flex items-center gap-4">
                      <span className="bg-input h-px w-full"></span>
                      <span className="text-muted-foreground text-xs">OR</span>
                      <span className="bg-input h-px w-full"></span>
                    </div>
                  )}

                  {googleSignupEnabled && (
                    <Button variant="outline" className="w-full">
                      <FcGoogle className="mr-2 size-5" />
                      {googleText}
                    </Button>
                  )}

                  {facebookSignupEnabled && (
                    <Button variant="outline" className="w-full">
                      <img
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg"
                        alt="Facebook"
                        className="mr-2 size-5"
                      />
                      {facebookText}
                    </Button>
                  )}

                  {appleSignupEnabled && (
                    <Button variant="outline" className="w-full">
                      <FaApple className="mr-2 size-5" />
                      {appleText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {setShowSignup && (
              <div className="text-muted-foreground mx-auto mt-8 flex justify-center gap-1 text-sm">
                <p>{loginText}</p>
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-primary font-medium hover:underline"
                >
                  Log in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Signup4 }
