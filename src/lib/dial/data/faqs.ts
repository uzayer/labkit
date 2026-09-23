/**
 * Contextual questions, placed on the page where the question is actually
 * asked rather than collected into one FAQ page.
 *
 * Every answer here restates something the site already shows (a rule in the
 * data model, a link that exists, a term from CONTEXT.md). None of it states a
 * new fact about DIAL, but it is still prototype copy: DIAL reviews it before
 * launch, like all other prose (labs/dial/identity.md).
 */

export interface Faq {
  title: string
  body: string
}

/** /publications — asked while looking at a list of papers. */
export const publicationFaqs: Faq[] = [
  {
    title: 'How do I cite one of these?',
    body: 'Each entry with a citation has a Cite action that copies a formatted reference. Where a paper has a DOI, the DOI link is the canonical destination and the one to cite.',
  },
  {
    title: 'Why do some entries have no DOI?',
    body: 'Regional venues, workshop papers, and extended abstracts often have no DOI at all. Those records are built from the citation itself, so they carry a venue and a year but no link.',
  },
  {
    title: 'Can I read a paper the link does not reach?',
    body: 'Open-access entries are marked as such. For anything behind a paywall, email the lab and ask for a copy.',
  },
]

/** /projects — asked while browsing the directory. */
export const projectFaqs: Faq[] = [
  {
    title: 'Why do projects have Bengali names?',
    body: 'Because that is what they are called. Where the lab named a project in Bengali, that name leads and the English title follows; the name is part of the work, not decoration.',
  },
  {
    title: 'What does “ongoing” mean here?',
    body: 'That the lab is still actively working on it. Projects with no status recorded show none rather than guessing, and completed work stays listed with its publications and awards.',
  },
  {
    title: 'Can I work on one of these?',
    body: 'Yes. Most projects are run by research assistants, and the lab recruits undergraduate and graduate students each intake. Join the lab for what is open now.',
  },
]

/** /people — asked while reading the roster. */
export const peopleFaqs: Faq[] = [
  {
    title: 'Who appears on this page?',
    body: 'Faculty and research staff, graduate and undergraduate research assistants, and collaborators the lab works with directly. Co-authors from other institutions are part of the publication record but are not listed here as lab members.',
  },
  {
    title: 'What happens when someone leaves?',
    body: 'They move to the alumni list with where they went next, which is the part of the roster that shows what working here leads to.',
  },
]

/** /awards — asked while reading the awards table. */
export const awardFaqs: Faq[] = [
  {
    title: 'Whose award is it, the lab’s or a person’s?',
    body: 'This page lists awards made to the lab and its work. Awards given to an individual appear on that person’s profile instead, so neither list inflates the other.',
  },
  {
    title: 'Are research grants counted here?',
    body: 'No. A grant is funding awarded to do work; an award is recognition for work already done. Grants appear on the projects and profiles they fund.',
  },
]

/** /research/[theme] — asked while reading a single theme. */
export const themeFaqs: Faq[] = [
  {
    title: 'How is work assigned to a theme?',
    body: 'The lab keeps its own short list of themes and files projects and publications under them by hand. It is not a standard subject taxonomy, and it is meant to describe this lab rather than the field.',
  },
  {
    title: 'Can one project sit under several themes?',
    body: 'Yes, and many do. A project on digital safety for women sits under both Gender & Feminist HCI and Safety & Security, so it appears on both pages.',
  },
]
