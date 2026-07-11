import { Footer } from '@/payload-types'
import {
  FaAndroid,
  FaApple,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRedditAlien,
  FaTwitter,
} from 'react-icons/fa'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Footer5: React.FC<{ footer: Footer; publicContext: PublicContextProps }> = ({
  footer,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {footer.navItems &&
              footer.navItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 font-bold">{section.title}</h3>
                  <ul className="space-y-4 text-muted-foreground">
                    {section.subNavItems &&
                      section.subNavItems.map((link, linkIdx) => (
                        <li key={linkIdx} className="font-medium hover:text-primary">
                          <CMSLink publicContext={publicContext} {...link.link} />
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
          <div className="mt-10 gap-10">
            <div className="grid gap-8 lg:grid-cols-4 lg:flex-row">
              <div className="col-span-3">
                <p className="mb-3 font-bold">Follow us</p>
                <ul className="flex items-center gap-2 text-muted-foreground">
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaFacebook className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaRedditAlien className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaTwitter className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaInstagram className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaLinkedin className="size-6" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-3 font-bold">Mobile App</p>
                <ul className="flex items-center gap-2 text-muted-foreground">
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaAndroid className="size-6" />
                      </span>
                    </a>
                  </li>
                  <li className="font-medium">
                    <a href="#">
                      <span className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors hover:text-primary">
                        <FaApple className="size-6" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-24 border-t pt-8">
            <p className="text-center text-sm font-medium text-muted-foreground">
              {footer.copyright && `© ${new Date().getFullYear()} ${footer.copyright}`}
            </p>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default Footer5
