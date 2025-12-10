'use client'
import * as React from 'react'
import { SelectInput, useField, useWatchForm, usePayloadAPI } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type CustomSelectProps = {
  path: string
  relationto: string
}

const SectionSelect: React.FC<CustomSelectProps> = ({ path, relationto }) => {
  const { getDataByPath } = useWatchForm()
  const formState: { reference?: { value?: string } } = getDataByPath(
    path.replace(/\.section$/, ''),
  )
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])

  // Use usePayloadAPI hook to fetch page data only when we have a reference
  const apiUrl = `/api/${relationto}/${formState?.reference?.value}`

  const [{ data: pageData, isLoading, isError }, { setParams }] = usePayloadAPI(apiUrl, {
    initialData: null,
  })

  // Reset form field if parent selection changes
  const [initialRender, setInitialRender] = useState(true)
  useEffect(() => {
    setInitialRender(false)
  }, [])
  useEffect(() => {
    if (!initialRender) {
      setValue('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState?.reference?.value])

  // Process page data into options and handle reference changes
  useEffect(() => {
    if (!formState?.reference?.value) {
      setOptions([])
      return
    }

    // Trigger API call when reference changes
    setParams({})
  }, [formState?.reference?.value, setParams])

  // Process page data into options
  useEffect(() => {
    if (formState?.reference?.value && pageData?.layout) {
      const pageOptions = pageData.layout.map((block: any, i: number) => ({
        label: `Section ${i + 1} (${block?.blockName || block?.blockType})`,
        value: block?.id,
      }))
      setOptions(pageOptions)
    } else if (!formState?.reference?.value) {
      setOptions([])
    }
  }, [pageData, formState?.reference?.value])

  if (!formState?.reference?.value) {
    return <></>
  }

  // Prepare options with loading state
  const selectOptions = isLoading
    ? [{ label: 'Loading sections...', value: '', disabled: true }]
    : options

  if (isError) {
    return (
      <div className="field-type select">
        <label className="field-label">Section inside Document (optional)</label>
        <div className="field-description">Error loading sections from the referenced page</div>
      </div>
    )
  }

  if (options.length === 0 && !isLoading) {
    return (
      <div className="field-type select">
        <label className="field-label">Section inside Document (optional)</label>
        <div className="field-description">No sections found in the referenced page</div>
      </div>
    )
  }

  return (
    <div className="field-type select">
      <label className="field-label">Section inside Document (optional)</label>
      <SelectInput
        key={formState?.reference?.value + value}
        path={path}
        name={path}
        options={selectOptions}
        value={isLoading ? '' : value}
        onChange={(e) => {
          if (!isLoading) {
            setValue((e as any)?.value || '')
          }
        }}
      />
      <div className="field-description">
        {isLoading
          ? 'Loading sections from the referenced page...'
          : 'Select a block from the referenced page to link to'}
      </div>
    </div>
  )
}

export default SectionSelect
