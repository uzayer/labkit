'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { LabInfo } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { updateLabInfo } from '../../actions/settings'

const settingsSchema = z.object({
  name: z.string().min(1, { message: 'Lab name is required.' }),
  shortName: z.string().optional(),
  description: z.string().optional(),
  parentOrganizationName: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: 'Enter a valid email address.',
    }),
  url: z.string().optional(),
  featureProjects: z.boolean(),
  featureGrants: z.boolean(),
  featureAwards: z.boolean(),
  featureResearchThemes: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

const FEATURE_TOGGLES = [
  ['featureProjects', 'Projects'],
  ['featureGrants', 'Grants'],
  ['featureAwards', 'Awards'],
  ['featureResearchThemes', 'Research Themes'],
] as const

interface SettingsFormProps {
  labInfo: LabInfo
}

export function SettingsForm({ labInfo }: SettingsFormProps) {
  const router = useRouter()
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: labInfo.name ?? '',
      shortName: labInfo.shortName ?? '',
      description: labInfo.description ?? '',
      parentOrganizationName: labInfo.parentOrganization?.name ?? '',
      email: labInfo.email ?? '',
      url: labInfo.url ?? '',
      featureProjects: labInfo.features?.projects ?? true,
      featureGrants: labInfo.features?.grants ?? true,
      featureAwards: labInfo.features?.awards ?? true,
      featureResearchThemes: labInfo.features?.researchThemes ?? true,
    },
  })

  async function onSubmit(values: SettingsFormValues) {
    const result = await updateLabInfo({
      name: values.name,
      shortName: values.shortName,
      description: values.description,
      parentOrganizationName: values.parentOrganizationName,
      email: values.email,
      url: values.url,
      features: {
        projects: values.featureProjects,
        grants: values.featureGrants,
        awards: values.featureAwards,
        researchThemes: values.featureResearchThemes,
      },
    })

    if (!result.success) {
      toast.error(result.error ?? 'Failed to save settings')
      return
    }

    toast.success('Lab settings saved.')
    router.refresh()
  }

  return (
    <Form {...form}>
      <form className="grid max-w-2xl gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Lab identity</CardTitle>
            <CardDescription>
              Used across schema.org markup, SEO metadata, and the public site.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormDescription>1-2 sentences, used for SEO and schema.org.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentOrganizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent institution</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab website URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard features</CardTitle>
            <CardDescription>
              Hide sections this lab doesn&apos;t use. Turning one off only affects nav/dashboard
              gating, not existing data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {FEATURE_TOGGLES.map(([name, label]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                    <FormLabel className="font-normal">{label}</FormLabel>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>

        <Button className="w-fit" disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {form.formState.isSubmitting ? 'Saving...' : 'Save settings'}
        </Button>
      </form>
    </Form>
  )
}
