import { Icon } from '@/components/Icon'
import RichText from '@/components/RichText'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { ContactBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utilities/ui'

interface DashedLineProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const DashedLine = ({ orientation = 'horizontal', className }: DashedLineProps) => {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={cn(
        'text-muted-foreground relative',
        isHorizontal ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    >
      <div
        className={cn(
          isHorizontal
            ? [
                'h-px w-full',
                'bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]',
                '[mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]',
              ]
            : [
                'h-full w-px',
                'bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_8px)]',
                '[mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)]',
              ],
        )}
      />
    </div>
  )
}

const Contact10: React.FC<ContactBlock & { publicContext: PublicContextProps }> = ({
  richText,
  contactBlocks,
  label1,
  form,
  publicContext,
}) => {
  return (
    <section className="via-background to-background relative mx-2.5 mt-2.5 rounded-t-2xl rounded-b-[36px] bg-linear-to-b from-amber-50 py-32 lg:mx-4 dark:from-amber-950">
      <div className="container max-w-2xl">
        {richText && (
          <RichText
            publicContext={publicContext}
            content={richText}
            withWrapper={false}
            overrideStyle={{
              h1: 'text-center text-4xl font-semibold tracking-tight lg:text-5xl',
              h2: 'text-center text-3xl font-semibold tracking-tight lg:text-4xl',
              p: 'text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto',
            }}
          />
        )}

        {Array.isArray(contactBlocks) && contactBlocks.length > 0 && (
          <div className="mt-10 flex justify-between gap-8 max-sm:flex-col md:mt-14 lg:mt-20 lg:gap-12">
            {contactBlocks.map((block) => (
              <div key={block.id}>
                {block.icon && (
                  <div className="mb-3">
                    <Icon icon={block.icon} size={20} />
                  </div>
                )}
                {block.description && (
                  <RichText
                    publicContext={publicContext}
                    content={block.description}
                    withWrapper={false}
                    overrideStyle={{
                      h2: 'font-semibold',
                      h3: 'font-semibold',
                      p: 'text-muted-foreground mt-3',
                      a: 'text-muted-foreground hover:text-foreground',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <DashedLine className="my-12" />

        <div className="mx-auto">
          {label1 && <h2 className="text-lg font-semibold">{label1}</h2>}

          {form && form[0]?.form && (
            <div className="mt-8">
              <RenderBlocks blocks={form} publicContext={publicContext} disableContainer />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Contact10
