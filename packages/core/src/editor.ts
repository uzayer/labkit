import {
  BoldFeature,
  defaultColors,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  ParagraphFeature,
  TextStateFeature,
  UnderlineFeature,
} from '@payloadcms/richtext-lexical'

/** The root rich-text editor, which every richText field without its own editor inherits. */
export const labkitEditor = () =>
  lexicalEditor({
    features: () => {
      return [
        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
        FixedToolbarFeature(),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        ParagraphFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts', 'projects'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: (_, siblingData) => siblingData.linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),

        TextStateFeature({
          state: {
            color: {
              'text-grey': {
                label: 'Grey',

                css: {
                  color: 'hsl(0, 0%, 41%)',
                },
              },
              ...defaultColors.text,
            },
          },
        }),
      ]
    },
  })
