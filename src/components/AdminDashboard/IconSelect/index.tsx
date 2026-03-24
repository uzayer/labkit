'use client'
import * as React from 'react'
import { SelectInput, useField } from '@payloadcms/ui'
import * as lucide from 'lucide-react'
import { Icon } from '@/components/Icon'
import { OptionObject } from 'payload'

export type OptionsData = Record<
  string,
  {
    label: string
    value: string
  }[]
>

type CustomSelectProps = {
  path: string
  options: OptionsData
  field?: {
    label?: string
    description?: string
  }
}

const keys = Object.keys(lucide).filter(
  (v) => !['default', 'icons'].includes(v) && !v.startsWith('Lucide') && !v.endsWith('Icon'),
)

const IconSelect: React.FC<CustomSelectProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })

  return (
    <div className="field-type select">
      {field?.label && <label className="field-label">{field?.label}</label>}
      <SelectInput
        path={path}
        name={path}
        options={
          keys.map((k) => ({
            label: (
              <span className="flex items-center gap-2">
                <Icon style={{ width: 16, height: 16 }} icon={k as any} /> {k}
              </span>
            ),
            value: k,
          })) as any as OptionObject[]
        }
        value={value}
        onChange={(e) => setValue((e as any)?.value || '')}
      />
      {field?.description && <div className="field-description">{field?.description}</div>}
    </div>
  )
}

export default IconSelect
