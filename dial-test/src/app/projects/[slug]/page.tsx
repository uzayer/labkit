import { notFound } from 'next/navigation'

import { ProjectPost } from '@/components/project-post'
import { getProjectBySlug, projects } from '@/data'
import { toProjectPost } from '@/data/views'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

// Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  return project ? { title: project.title, description: project.abstract ?? undefined } : {}
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  return <ProjectPost project={toProjectPost(project)} />
}
