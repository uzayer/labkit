import { Footer } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Footer2: React.FC<{ footer: Footer; publicContext: PublicContextProps }> = ({
  footer,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              {footer.logo && (
                <Media resource={footer.logo} className="mb-4" imgClassName="h-8 w-auto" />
              )}
              <p className="font-bold">{footer.subline && footer.subline}</p>
            </div>
            {footer.navItems &&
              footer.navItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 font-bold">{section.title}</h3>
                  <ul className="text-muted-foreground space-y-4">
                    {section?.subNavItems &&
                      section.subNavItems.map((link, linkIdx) => (
                        <li key={linkIdx} className="hover:text-primary font-medium">
                          <CMSLink publicContext={publicContext} {...link.link} />
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
          <div className="text-muted-foreground mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
            <p>{footer.copyright && `© ${new Date().getFullYear()} ${footer.copyright}`}</p>
            <ul className="flex gap-4">
              {footer.legalLinks?.map((item, index) => (
                <li key={index} className="hover:text-primary underline">
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

export default Footer2
