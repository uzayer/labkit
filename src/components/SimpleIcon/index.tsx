import {
  siFacebook,
  siGithub,
  siInstagram,
  siX,
  type SimpleIcon as SimpleIconData,
} from 'simple-icons'

type BrandIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string
}

type SimpleIconProps = BrandIconProps & {
  icon: SimpleIconData
}

export const SimpleIcon: React.FC<SimpleIconProps> = ({ icon, title = icon.title, ...props }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-label={title} {...props}>
    <title>{title}</title>
    <path d={icon.path} />
  </svg>
)

const createSimpleIcon = (icon: SimpleIconData) => {
  const Component: React.FC<BrandIconProps> = (props) => <SimpleIcon icon={icon} {...props} />
  Component.displayName = `${icon.slug}Icon`
  return Component
}

export const FacebookIcon = createSimpleIcon(siFacebook)
export const GithubIcon = createSimpleIcon(siGithub)
export const InstagramIcon = createSimpleIcon(siInstagram)
export const XIcon = createSimpleIcon(siX)

export const LinkedInIcon: React.FC<BrandIconProps> = ({ title = 'LinkedIn', ...props }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" aria-label={title} {...props}>
    <title>{title}</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.941v5.665H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
  </svg>
)
