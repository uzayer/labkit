import {
  FaApple,
  FaDiscord,
  FaGooglePlay,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
} from 'react-icons/fa'

import { Separator } from '@/components/ui/separator'
import { Footer } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Footer1: React.FC<{ footer: Footer; publicContext: PublicContextProps }> = ({
  footer,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            {footer.logo && (
              <Media resource={footer.logo} alt="logo" className="mr-auto mb-8 h-7 md:mb-0" />
            )}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <p className="text-lg font-medium">Copy the code and make it yours.</p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="bg-primary inline-flex items-center justify-center rounded-lg p-2.5"
                >
                  <FaApple className="text-background size-7" />
                </a>
                <a
                  href="#"
                  className="bg-primary inline-flex items-center justify-center rounded-lg p-2.5"
                >
                  <FaGooglePlay className="text-background size-6" />
                </a>
              </div>
            </div>
          </div>
          <Separator className="my-14" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {footer.navItems &&
              footer.navItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 font-bold">{section.title}</h3>
                  <ul className="text-muted-foreground space-y-4">
                    {section.subNavItems &&
                      section.subNavItems.map((subitem) => (
                        <li key={subitem.id} className="hover:text-primary font-medium">
                          <CMSLink publicContext={publicContext} {...subitem.link} />
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            <div>
              <h3 className="mb-4 font-bold">Legal</h3>
              <ul className="text-muted-foreground space-y-4">
                <li className="hover:text-primary font-medium">
                  <a href="#">Term of Services</a>
                </li>
                <li className="hover:text-primary font-medium">
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
              <h3 className="mt-8 mb-4 font-bold">Social</h3>
              <ul className="text-muted-foreground flex items-center space-x-6">
                <li className="hover:text-primary font-medium">
                  <a href="#">
                    <FaDiscord className="size-6" />
                  </a>
                </li>
                <li className="hover:text-primary font-medium">
                  <a href="#">
                    <FaRedditAlien className="size-6" />
                  </a>
                </li>
                <li className="hover:text-primary font-medium">
                  <a href="#">
                    <FaTwitter className="size-6" />
                  </a>
                </li>
                <li className="hover:text-primary font-medium">
                  <a href="#">
                    <FaTelegramPlane className="size-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-14" />
          <p className="text-muted-foreground text-sm">
            {footer.copyright && `© ${new Date().getFullYear()} ${footer.copyright}`}
          </p>
        </footer>
      </div>
    </section>
  )
}

export default Footer1
