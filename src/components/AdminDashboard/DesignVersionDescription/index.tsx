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
        path: '@/components/AdminDashboard/DesignVersionDescription',
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

/**
 * A React component that displays a design version description.
 * @param {Object} props - The component props.
 * @param {{en: string, de?: string}} props.description - The description object with language keys.
 * @param {Object} props.i18n - The i18n object containing language information.
 * @returns {JSX.Element} A paragraph element with the localized description.
 */
const DesignVersionDescription: React.FC<any> = ({ description, i18n }) => {
  const lang = i18n?.language || i18n?.fallbackLanguage || 'en'
  return <p style={{ color: 'red', marginBottom: 10 }}>{description?.[lang] || description?.en}</p>
}

export default DesignVersionDescription
