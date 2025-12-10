import { FaDiscord, FaTwitter } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Footer } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Footer4: React.FC<{ footer: Footer; publicContext: PublicContextProps }> = ({
  footer,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 flex h-full items-center justify-between md:items-start lg:col-span-3 lg:flex-col">
              {footer.logo && <Media resource={footer.logo} alt="logo" className="h-7" />}
              <ul className="text-muted-foreground flex items-center space-x-6">
                <li className="hover:text-primary font-medium">
                  <a href="#">
                    <FaDiscord className="size-6" />
                  </a>
                </li>

                <li className="hover:text-primary font-medium">
                  <a href="#">
                    <FaTwitter className="size-6" />
                  </a>
                </li>
              </ul>
            </div>
            <Separator className="col-span-2 my-6 lg:hidden" />
            {footer.navItems &&
              footer.navItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 font-bold">{section.title}</h3>
                  <ul className="text-muted-foreground space-y-4">
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
          <Separator className="my-14 lg:my-20" />
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="mb-2 text-3xl font-semibold lg:text-4xl">Join our newsletter</p>
              <p className="text-muted-foreground">Get exclusive news, features, and updates.</p>
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" />
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
          <Separator className="my-14 lg:my-20" />
          <div className="text-muted-foreground flex flex-col justify-between gap-4 text-sm font-medium md:flex-row md:items-center">
            <ul className="flex gap-4">
              {footer.legalLinks?.map((item, index) => (
                <li key={index} className="hover:text-primary underline">
                  <CMSLink publicContext={publicContext} {...item.link} />
                </li>
              ))}
            </ul>
            <p>{footer.copyright && `© ${new Date().getFullYear()} ${footer.copyright}`}</p>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default Footer4
