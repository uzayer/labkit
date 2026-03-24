import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import Footer1 from './footer/footer1'
import Footer2 from './footer/footer2'
import Footer3 from './footer/footer3'
import Footer4 from './footer/footer4'
import Footer5 from './footer/footer5'
import Footer6 from './footer/footer6'
import Footer7 from './footer/footer7'
import Footer8 from './footer/footer8'
import { PublicContextProps } from '@/utilities/publicContextProps'

export async function Footer({ publicContext }: { publicContext: PublicContextProps }) {
  const footer: Footer = await getCachedGlobal('footer', publicContext.locale, 2)()

  const footerType = footer.designVersion

  switch (footerType) {
    case '1':
      return <Footer1 footer={footer} publicContext={publicContext} />
    case '2':
      return <Footer2 footer={footer} publicContext={publicContext} />
    case '3':
      return <Footer3 footer={footer} publicContext={publicContext} />
    case '4':
      return <Footer4 footer={footer} publicContext={publicContext} />
    case '5':
      return <Footer5 footer={footer} publicContext={publicContext} />
    case '6':
      return <Footer6 footer={footer} publicContext={publicContext} />
    case '7':
      return <Footer7 footer={footer} publicContext={publicContext} />
    case '8':
      return <Footer8 footer={footer} publicContext={publicContext} />
  }

  return null

  // return (
  //   <footer className="border-t border-border bg-black dark:bg-card text-white">
  //     <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
  //       <Link className="flex items-center" href="/">
  //         <picture>
  //           <img
  //             alt="Payload Logo"
  //             className="max-w-24 invert-0"
  //             src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/payload/src/admin/assets/images/payload-logo-light.svg"
  //           />
  //         </picture>
  //       </Link>

  //       <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
  //         <ThemeSelector />
  //         <nav className="flex flex-col md:flex-row gap-4">
  //           {navItems.map(({ link }, i) => {
  //             return <CMSLink publicContext={publicContext} className="text-white" key={i} {...link} />
  //           })}
  //         </nav>
  //       </div>
  //     </div>
  //   </footer>
  // )
}
