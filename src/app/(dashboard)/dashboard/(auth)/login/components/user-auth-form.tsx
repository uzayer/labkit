'use client'

import { HTMLAttributes } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

interface LoginResponseBody {
  errors?: {
    message?: string
  }[]
  message?: string
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
})

export function UserAuthForm({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const forbidden = searchParams.get('error') === 'forbidden'

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as LoginResponseBody | null
        const message =
          body?.errors?.[0]?.message || body?.message || 'Unable to sign in with those credentials.'

        form.setError('root', { message })
        toast.error(message)
        return
      }

      toast.success('Signed in. Redirecting to the dashboard.')
      router.push('/dashboard')
      router.refresh()
    } catch {
      const message = 'A network error prevented sign-in. Please try again.'

      form.setError('root', { message })
      toast.error(message)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            {forbidden ? (
              <p className="text-sm leading-6 text-destructive" role="alert">
                This dashboard is restricted to admin accounts.
              </p>
            ) : null}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/dashboard/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root?.message ? (
              <p className="text-sm leading-6 text-destructive" role="alert">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <Button className="mt-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
