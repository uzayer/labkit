import { FaDiscord, FaLinkedin, FaRedditAlien, FaTelegramPlane, FaTwitter } from 'react-icons/fa'
import { Media } from '@/components/Media'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Footer } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Footer3: React.FC<{ footer: Footer; publicContext: PublicContextProps }> = ({
  footer,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          {footer.logo && <Media resource={footer.logo} alt="logo" className="h-7" />}
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4">
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
            <div className="lg:col-span-2 xl:col-span-1">
              <ul className="text-muted-foreground mb-10 flex items-center gap-2">
                <li className="font-medium">
                  <a href="#">
                    <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                      <FaDiscord className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a href="#">
                    <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                      <FaRedditAlien className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a href="#">
                    <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                      <FaTwitter className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a href="#">
                    <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                      <FaTelegramPlane className="size-6" />
                    </span>
                  </a>
                </li>
                <li className="font-medium">
                  <a href="#">
                    <span className="bg-muted hover:text-primary flex size-12 items-center justify-center rounded-full transition-colors">
                      <FaLinkedin className="size-6" />
                    </span>
                  </a>
                </li>
              </ul>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Subscribe to our newsletter</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="email" placeholder="Email" />
                  <Button type="submit">Subscribe</Button>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  By submitting, you agree to our
                  <a href="#" className="text-primary ml-1 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="text-muted-foreground mt-24 flex flex-col flex-wrap justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
            <p>{footer.copyright && `© ${new Date().getFullYear()} ${footer.copyright}`}</p>
            <ul className="flex gap-4">
              {footer.legalLinks?.map((item, index) => (
                <li key={index} className="hover:text-primary whitespace-nowrap underline">
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

export default Footer3
