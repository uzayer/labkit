'use client'

import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import React from 'react'
import 'react-phone-number-input/style.css'
import { Controller } from 'react-hook-form'
import dynamic from 'next/dynamic'

import { Error } from '../Error'
import { Width } from '../Width'

const PhoneInputDynamic = dynamic(() => import('react-phone-number-input'), {
  ssr: false,
  loading: () => (
    <div className="phone-input border-border/40 bg-card ring-offset-background placeholder:text-muted-foreground flex h-12 w-full animate-pulse rounded-md border px-3 py-2 text-sm">
      <div className="flex w-full items-center space-x-2">
        <div className="bg-muted h-4 w-8 rounded"></div>
        <div className="bg-muted h-4 flex-1 rounded"></div>
      </div>
    </div>
  ),
})

export const Phone: React.FC<
  TextField & {
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, defaultValue, control, errors, label, required: requiredFromProps, width }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}
        {requiredFromProps && <span className="ml-1">*</span>}
      </Label>
      <Controller
        control={control}
        defaultValue={defaultValue || ''}
        name={name}
        render={({ field: { onChange, value, onBlur } }) => (
          <PhoneInputDynamic
            international={true}
            defaultCountry="DE"
            placeholder={`${label} ${requiredFromProps ? '*' : ''}`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            id={name}
            className="phone-input border-border bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}
        rules={{ required: requiredFromProps }}
      />
      {requiredFromProps && errors[name] && <Error />}
    </Width>
  )
}

export default Phone
