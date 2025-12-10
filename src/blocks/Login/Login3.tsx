'use client'

import { Fragment, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { LoginBlock } from '@/payload-types'
import { SignupBlock } from '@/blocks/Signup/Component'
import { login, LoginFormData } from '@/actions/auth/login'

const Login3: React.FC<LoginBlock & { publicContext: PublicContextProps }> = ({
  heading = 'Login',
  subheading = 'Welcome back',
  loginText = 'Log in',
  googleText = 'Log in with Google',
  dontHaveAccountText = "Don't have an account?",
  signupEnabled = true,
  googleLoginEnabled = true,
  facebookLoginEnabled = false,
  appleLoginEnabled = false,
  signupBlock,
}) => {
  const [showSignup, setShowSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Toggle between login and signup views
  const toggleSignup = () => {
    setShowSignup(!showSignup)
    setError(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData: LoginFormData = {
        email,
        password,
        rememberMe,
      }

      const result = await login(formData)

      // Handle successful login
      // You might want to redirect the user or update UI state here
      // For now, we'll just log the result
      console.log('Login successful', result)

      // Optionally redirect after successful login
      // window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // If signup is enabled and showSignup is true, render the signup view
  if (signupEnabled && showSignup && signupBlock?.[0]) {
    return (
      <Fragment>
        <SignupBlock {...signupBlock[0]} setShowSignup={setShowSignup} />
      </Fragment>
    )
  }

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              {/* <a href={logo.url} className="mb-6 flex items-center gap-2">
                <img src={logo.src} className="max-h-8" alt={logo.alt} />
              </a> */}
              <h1 className="mb-2 text-2xl font-bold">{heading}</h1>
              <p className="text-muted-foreground">{subheading}</p>
            </div>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="bg-background"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <div className="grid gap-4">
                  <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : loginText}
                  </Button>

                  {(googleLoginEnabled || facebookLoginEnabled || appleLoginEnabled) && (
                    <div className="flex items-center gap-4">
                      <span className="bg-input h-px w-full"></span>
                      <span className="text-muted-foreground text-xs">OR</span>
                      <span className="bg-input h-px w-full"></span>
                    </div>
                  )}

                  {googleLoginEnabled && (
                    <Button variant="outline" className="w-full">
                      <FcGoogle className="mr-2 size-5" />
                      {googleText}
                    </Button>
                  )}

                  {facebookLoginEnabled && (
                    <Button variant="outline" className="w-full">
                      <img
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg"
                        alt="Facebook"
                        className="mr-2 size-5"
                      />
                      Log in with Facebook
                    </Button>
                  )}

                  {appleLoginEnabled && (
                    <Button variant="outline" className="w-full">
                      <FaApple className="mr-2 size-5" />
                      Log in with Apple
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-muted-foreground"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-primary text-sm hover:underline">
                  Forgot password
                </a>
              </div>
            </form>
            {signupEnabled && (
              <div className="text-muted-foreground mx-auto mt-8 flex justify-center gap-1 text-sm">
                <p>{dontHaveAccountText}</p>
                <button onClick={toggleSignup} className="text-primary font-medium hover:underline">
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Login3 }
