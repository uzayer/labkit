import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { LogosBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Logos1: React.FC<LogosBlock & { publicContext: PublicContextProps }> = ({
  richText,
  logos,
  publicContext,
}) => {
  return (
    <section className="container flex flex-wrap items-center justify-between gap-8 py-32">
      {richText && (
        <RichText
          publicContext={publicContext}
          content={richText}
          enableGutter={false}
          overrideStyle={{
            p: 'text-lg leading-[140%] tracking-[-0.32px] text-primary',
          }}
        />
      )}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-6 opacity-70 grayscale lg:gap-[60px]">
        {logos?.map((logo, index) => (
          <Media key={index} resource={logo} imgClassName="h-12 w-28 object-contain" />
        ))}
      </div>
    </section>
  )
}

export default Logos1
