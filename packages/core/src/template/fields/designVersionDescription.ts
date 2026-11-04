import { Condition, Field } from 'payload'

/**
 * Creates a conditional description field for feature design versions in the Payload CMS admin interface.
 * When used in a block config (like Feature blocks), this utility creates a UI field that displays
 * important requirements or usage instructions for specific design versions.
 * @param {string} name - The name of the field.
 * @param {Condition<any, any>} condition - The condition for rendering the field.
 * @param {{en: string, de?: string}} description - The description in English and optionally in German.
 * @returns {Field} A Payload CMS field configuration object.
 */
export const designVersionDescription = (
  name: string,
  condition: Condition<any, any>,
  description: {
    en: string
    de?: string
  },
): Field => ({
  type: 'ui',
  name,
  admin: {
    condition,
    components: {
      Field: {
        path: '@labkit/core/rsc#DesignVersionDescription',
        serverProps: {
          description: {
            en: description?.en,
            de: description?.de,
          },
        },
        clientProps: {
          description: {
            en: description?.en,
            de: description?.de,
          },
        },
      },
    },
  },
})
