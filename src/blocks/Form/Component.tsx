'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

import Turnstile from 'react-turnstile'
import { PublicContextProps } from '@/utilities/publicContextProps'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  disableContainer?: boolean
  introContent?: {
    [k: string]: unknown
  }[]
}

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType & { publicContext: PublicContextProps }
> = (props) => {
  const {
    enableIntro,
    disableContainer,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
    publicContext,
  } = props

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps?.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
          setError({
            message: 'Turnstile token is required.',
            status: '500',
          })
          return
        }
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch('/api/form-submissions', {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
              ...(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
                ? { 'cf-turnstile-token': turnstileToken }
                : {}),
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, turnstileToken],
  )

  if (!formFromProps?.fields) return null

  const form = (
    <FormProvider {...formMethods}>
      {enableIntro && introContent && !hasSubmitted && (
        <RichText
          publicContext={publicContext}
          className="mb-8"
          content={introContent}
          enableGutter={false}
        />
      )}
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText publicContext={publicContext} content={confirmationMessage} />
      )}
      {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
      {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
      {!hasSubmitted && (
        <form id={formID} onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex flex-wrap gap-4 last:mb-0">
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields?.map((field, index) => {
                const Field: React.FC<any> = fields?.[field.blockType]
                if (Field) {
                  return (
                    <Field
                      key={index}
                      form={formFromProps}
                      {...field}
                      {...formMethods}
                      control={control}
                      errors={errors}
                      register={register}
                    />
                  )
                }
                return null
              })}
          </div>

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              refreshExpired="auto"
              className="mb-4"
              fixedSize={true}
              // when rendering as interaction only, this component is still taking the space, which looks weird,
              // so be better keep it visible for now
              // appearance="interaction-only"
              onSuccess={(token) => {
                setTurnstileToken(token)
              }}
              onError={(error) => {
                setError({
                  message:
                    'Bot protection could not verify that you are a real human. Cloudflare error code: ' +
                    error,
                  status: '500',
                })
              }}
            />
          )}

          <Button
            form={formID}
            type="submit"
            variant="default"
            disabled={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? !turnstileToken : false}
          >
            {submitButtonLabel}
          </Button>
        </form>
      )}
    </FormProvider>
  )
  return disableContainer ? form : <div className="container pb-20 lg:max-w-3xl">{form}</div>
}
