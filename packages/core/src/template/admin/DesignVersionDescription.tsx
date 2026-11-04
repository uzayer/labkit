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
