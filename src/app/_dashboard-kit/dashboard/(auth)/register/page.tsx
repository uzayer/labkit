import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { RegisterForm } from './components/register-form'

export default function RegisterPage() {
  return (
    <Card className="p-6">
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-lg font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password to create an account. <br />
          Already have an account?{' '}
          <Link href="/dashboard/login" className="underline underline-offset-4 hover:text-primary">
            Log In
          </Link>
        </p>
      </div>
      <RegisterForm />
      <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
        By creating an account, you agree to our{' '}
        <span className="underline underline-offset-4">Terms of Service</span> and{' '}
        <span className="underline underline-offset-4">Privacy Policy</span>.
      </p>
    </Card>
  )
}
