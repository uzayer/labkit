import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Hyperlink {
  label: string
  href: string
}

interface AcceptInvite1Props {
  companyLogo?: string
  disclaimer?: string
  disclaimerLink?: Hyperlink
  heading?: string
  description?: string[]
  copyright?: string
  footerLinks?: Hyperlink[]
}

const AcceptInvite1 = ({
  companyLogo = 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo-word.svg',
  disclaimer = 'By entering your email, you agree to receive updates and marketing messages from Acme You can unsubscribe at any time. For more details, please review our ',
  disclaimerLink = {
    label: 'privacy policy',
    href: '#',
  },
  heading = 'Welcome to Acme',
  description = [
    'Acme is a next-generation platform designed to streamline your workflow. Built with flexibility in mind, it adapts to your unique business needs.',
    'Manage your projects, collaborate with your team, and track progress all in one centralized dashboard.',
    'Get started today.',
  ],
  copyright = `© ${new Date().getFullYear()} Acme`,
  footerLinks = [
    { label: 'Privacy Policy', href: '#' },
    {
      label: 'Support',
      href: '#',
    },
  ],
}: AcceptInvite1Props) => {
  return (
    <section className="container py-32">
      <div className="flex w-full flex-col gap-20 sm:items-center">
        <img src={companyLogo} alt="company logo" className="w-54 dark:invert" />

        <div className="flex flex-col-reverse items-start gap-10 sm:rounded-2xl sm:border sm:px-10 sm:pt-10 sm:pb-10 md:flex-row md:pt-20 lg:gap-20 lg:rounded-3xl lg:px-24 lg:pt-36 xl:gap-40">
          <div className="flex w-full flex-col gap-6 sm:max-w-sm md:gap-60">
            <div className="flex flex-col gap-6">
              <Button type="button" variant="outline">
                <FcGoogle />
                Sign in with Google
              </Button>
              <span className="bg-border h-px w-full" />
              <form autoComplete="off" className="flex flex-col gap-3">
                <Input placeholder="Enter your email address" required />
                <Button type="submit">Continue</Button>
              </form>
            </div>
            <p className="text-muted-foreground text-xs">
              {disclaimer}
              <a href={disclaimerLink.href} className="underline">
                {disclaimerLink.label}
              </a>
              .
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:max-w-sm">
            <h3 className="text-2xl font-bold">{heading}</h3>
            <div className="text-muted-foreground space-y-4 text-sm font-medium">
              {description.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <p>{copyright}</p>
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="underline">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export { AcceptInvite1 }
