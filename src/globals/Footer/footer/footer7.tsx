import { Footer } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { SocialIcon } from '@/components/SocialIcon'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Footer7: React.FC<{ footer: Footer; publicContext: PublicContextProps }> = ({
  footer,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  {footer.logo && (
                    <Media resource={footer.logo} alt="logo" imgClassName="h-11 w-auto" />
                  )}
                  {/* <p className="text-3xl font-semibold">Shadcnblocks</p> */}
                </span>
                <p className="text-muted-foreground mt-6 text-sm">
                  {footer.subline && footer.subline}
                </p>
              </div>
              <ul className="text-muted-foreground flex items-center space-x-6">
                {footer.socialLinks?.map((social, index) => (
                  <li key={index} className="hover:text-primary font-medium">
                    <a href={social.url}>
                      <SocialIcon type={social.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {footer.navItems &&
                footer.navItems.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    <h3 className="mb-6 font-bold">{section.title}</h3>
                    <ul className="text-muted-foreground space-y-4 text-sm">
                      {section.subNavItems &&
                        section.subNavItems.map((link, linkIdx) => (
                          <li key={linkIdx} className="hover:text-primary font-medium">
                            <CMSLink publicContext={publicContext} {...link.link} />
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
          <div className="text-muted-foreground mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center text-sm font-medium lg:flex-row lg:items-center lg:text-left">
            <p>{footer.copyright && `© ${new Date().getFullYear()} ${footer.copyright}`}</p>
            <ul className="flex justify-center gap-4 lg:justify-start">
              {footer.legalLinks?.map((item, index) => (
                <li key={index} className="hover:text-primary">
                  <CMSLink publicContext={publicContext} {...item.link} />
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default Footer7
