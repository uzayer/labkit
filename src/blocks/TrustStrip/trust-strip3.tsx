import React from 'react'

import { TrustStripBlock } from '@/payload-types'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const TrustStrip3: React.FC<TrustStripBlock & { publicContext: PublicContextProps }> = ({
  certifications,
  guarantees,
}) => {
  return (
    <section className="border-y py-6">
      <div className="container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Certifications */}
          {Array.isArray(certifications) && certifications.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-muted flex items-center gap-2 rounded-full px-3 py-1.5"
                >
                  {cert.icon && (
                    <span className="text-muted-foreground">
                      <Icon icon={cert.icon} size={20} />
                    </span>
                  )}
                  {cert.name && <span className="text-sm font-medium">{cert.name}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Guarantees */}
          {Array.isArray(guarantees) && guarantees.length > 0 && (
            <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm md:justify-end">
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  {guarantee.text && <span>{guarantee.text}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
