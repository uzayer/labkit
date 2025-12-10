import type { Block } from 'payload'

export const MotionText: Block = {
  slug: 'motionText',
  fields: [
    {
      name: 'textLevel',
      type: 'select',
      label: 'Text Level',
      defaultValue: 'h1',
      options: [
        { label: 'Large Title (H1)', value: 'h1' },
        { label: 'Title (H2)', value: 'h2' },
        { label: 'Subtitle (H3)', value: 'h3' },
        { label: 'Heading (H4)', value: 'h4' },
        { label: 'Subheading (H5)', value: 'h5' },
        { label: 'Small Heading (H6)', value: 'h6' },
        { label: 'Inline Text (Span)', value: 'span' },
      ],
      admin: {
        description: 'Choose the semantic level and styling for the motion text',
      },
    },
    {
      name: 'prefix',
      type: 'text',
      label: 'Text before animated words',
      admin: {
        description: 'Text that appears before the animated portion (e.g., "The only app you Need to")',
      },
    },
    {
      name: 'animatedWords',
      type: 'array',
      label: 'Animated Words',
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Words that will animate in with motion effects',
      },
      fields: [
        {
          name: 'word',
          type: 'text',
          required: true,
        },
        {
          name: 'isHighlighted',
          type: 'checkbox',
          label: 'Special styling',
          admin: {
            description: 'Apply special styling (e.g., different font) to this word',
          },
        },
        {
          name: 'highlightClass',
          type: 'text',
          label: 'CSS Class for highlighted word',
          admin: {
            condition: (_, siblingData) => siblingData?.isHighlighted,
            description: 'CSS class to apply when highlighted (e.g., "font-playfair")',
          },
        },
      ],
    },
    {
      name: 'suffix',
      type: 'text',
      label: 'Text after animated words',
      admin: {
        description: 'Text that appears after the animated portion (optional)',
      },
    },
    {
      name: 'animationDelay',
      type: 'number',
      label: 'Animation Delay (seconds)',
      admin: {
        description: 'Delay between each word animation (default: 0.08)',
      },
      defaultValue: 0.08,
    },
    {
      name: 'animationDuration',
      type: 'number',
      label: 'Animation Duration (seconds)',
      admin: {
        description: 'Duration of each word animation (default: 0.8)',
      },
      defaultValue: 0.8,
    },
    {
      name: 'className',
      type: 'text',
      label: 'Custom CSS Classes',
      admin: {
        description: 'Additional CSS classes to apply to the motion text container',
      },
    },
  ],
  interfaceName: 'MotionTextBlock',
}
