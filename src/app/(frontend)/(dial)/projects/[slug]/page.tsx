import { notFound } from 'next/navigation'

import { ProjectPost } from '@/components/dial/project-post'
import { getDial } from '@/lib/dial/data/get'

type Props = { params: Promise<{ slug: string }> }

// None at build: each page renders on its first request and is then cached
// like the rest of the site, until its records change (see ../../layout.tsx).
export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props) {
  const { getProjectBySlug } = await getDial()
  const { slug } = await params
  const project = getProjectBySlug(slug)
  return project ? { title: project.title, description: project.abstract ?? undefined } : {}
}

export default async function ProjectDetailPage({ params }: Props) {
  const { getProjectBySlug, toProjectPost } = await getDial()
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  return <ProjectPost project={toProjectPost(project)} />
}
