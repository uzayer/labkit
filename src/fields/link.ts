import type { Field } from 'payload'

import deepMerge from '@/utilities/deepMerge'
import { icon } from '@/components/Icon/config'

export type LinkAppearances =
  | 'default'
  | 'outline'
  | 'inline'
  | 'destructive'
  | 'ghost'
  | 'secondary'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
  inline: {
    label: 'Inline',
    value: 'inline',
  },
  destructive: {
    label: 'Destructive',
    value: 'destructive',
  },
  ghost: {
    label: 'Ghost',
    value: 'ghost',
  },
  secondary: {
    label: 'Secondary',
    value: 'secondary',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  disableIcon?: boolean
  overrides?: Record<string, unknown>
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'clear'
}) => Field

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  disableIcon = false,
  overrides = {},
} = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  /**
   * This link component should be related to
   */
  const relationTo = 'pages'

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      maxDepth: 1,
      relationTo: [relationTo],
      required: true,
    },
    {
      name: 'section',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
        components: {
          Field: {
            path: '@/components/AdminDashboard/SectionSelect',
            serverProps: {
              // there is no "clever" way to always get this information, so we need to set it additionally here as prop
              relationTo,
            },
          },
        },
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
      localized: true,
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (!disableIcon) {
    linkResult.fields.push({
      type: 'row',
      fields: [
        icon({
          name: 'iconBefore',
        }),
        icon({
          name: 'iconAfter',
        }),
      ],
    })
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = Object.values(appearanceOptions)

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      type: 'row',
      fields: [
        {
          name: 'appearance',
          type: 'select',
          admin: {
            description: 'Choose how the link should be rendered.',
          },
          defaultValue: 'default',
          options: appearanceOptionsToUse,
        },
        {
          name: 'size',
          type: 'select',
          options: ['default', 'sm', 'lg', 'icon', 'clear'],
        },
      ],
    })
  }

  return deepMerge(linkResult, overrides)
}
