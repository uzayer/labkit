'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface LoginResponseBody {
  errors?: {
    message?: string
  }[]
  message?: string
}

const dashboardLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email address.' })
    .email({ message: 'Enter a valid email address.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
})

interface DashboardLoginValues {
  email: string
  password: string
}

export default function DashboardLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const form = useForm<DashboardLoginValues>({
    resolver: zodResolver(dashboardLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const accessMessage =
    searchParams.get('error') === 'forbidden'
      ? 'This dashboard is restricted to admin accounts.'
      : 'Sign in with your LabKit account to access the dashboard.'

  async function onSubmit(values: DashboardLoginValues) {
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
        const nextErrorMessage =
          body?.errors?.[0]?.message || body?.message || 'Unable to sign in with those credentials.'

        form.setError('root', { message: nextErrorMessage })
        toast.error(nextErrorMessage)
        return
      }

      toast.success('Signed in. Redirecting to the dashboard.')
      router.push('/dashboard')
      router.refresh()
    } catch {
      const nextErrorMessage = 'A network error prevented sign-in. Please try again.'

      form.setError('root', { message: nextErrorMessage })
      toast.error(nextErrorMessage)
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--background),var(--primary)_8%),_var(--background)_55%)] px-6 py-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <Card className="w-full max-w-md border-border/80 bg-card/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-2">
          <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            LabKit Admin
          </p>
          <CardTitle className="text-3xl font-semibold tracking-tight">Dashboard Login</CardTitle>
          <CardDescription className="text-sm leading-6">{accessMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="email"
                        placeholder="name@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
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
              <Button className="mt-1 w-full" disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : null}
                {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
