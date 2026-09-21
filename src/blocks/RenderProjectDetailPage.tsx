import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Project } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

/**
 * Minimal stand-in project page. The template's case-study renderer was removed
 * with the schema freeze (ADR-0002); the real page is dial-test's, ported in
 * AUT-147. This exists only so `/projects/<slug>` and admin preview keep working.
 */
export const RenderProjectDetailPage: React.FC<{
  project: Project
  publicContext: PublicContextProps
}> = ({ project, publicContext }) => {
  const { title, localName, abstract, heroImage, content } = project

  return (
    <div className="container flex max-w-3xl flex-col gap-6 py-16">
      <header className="flex flex-col gap-2">
        {localName && <p className="text-muted-foreground">{localName}</p>}
        <h1 className="text-4xl font-semibold">{title}</h1>
        {abstract && <p className="text-lg text-muted-foreground">{abstract}</p>}
      </header>
      {heroImage && typeof heroImage === 'object' && <Media resource={heroImage} />}
      {content && <RichText content={content} publicContext={publicContext} withWrapper={false} />}
    </div>
  )
}
