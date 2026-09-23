import {
  InkBand,
  PrimaryLink,
  SectionHeader,
  TextLink,
  sectionSpacing,
} from '@/components/dial/editorial'
import { FieldNote } from '@/components/dial/field-note'
import { CropMarks, MarginNote, Tape, TickMark } from '@/components/dial/marks'
import { PageHeader } from '@/components/dial/page-header'
import { PhotoSlot } from '@/components/dial/photo-slot'
import type { RisoVariant } from '@/components/dial/riso'
import { ScrollRuler } from '@/components/dial/scroll-ruler'
import { cn } from '@/lib/utils'
import type { LabInfo } from '@/lib/dial/data'
import { getDial } from '@/lib/dial/data/get'

export const metadata = {
  title: 'Join the lab',
  description:
    'Join the Design Inclusion and Access Lab at North South University. No prerequisites: curiosity about people and technology is enough.',
}

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })

/**
 * The door is always open — the lab reads every email year-round — so the
 * status line says that first. The recorded window is a *cohort* intake, not
 * the only way in, and it is printed only while it is still ahead or running.
 * Reporting a closed window as the page's status made a standing invitation
 * read as "you missed it".
 */
function nextIntake(recruitment: LabInfo['recruitment'], now = new Date()): string | null {
  if (!recruitment) return null
  const opens = new Date(recruitment.opens)
  const closes = new Date(`${recruitment.closes}T23:59:59Z`)
  if (now > closes) return null
  const range = `${formatDay(recruitment.opens)} – ${formatDay(recruitment.closes)}, ${closes.getUTCFullYear()}`
  return now < opens ? `Next intake ${range}` : `Intake running now · ${range}`
}

const REASONS = [
  {
    title: 'No prerequisites',
    body: 'We look for curiosity, not credentials. If you ask good questions about people and technology, you belong here.',
  },
  {
    title: 'Fieldwork in Bangladesh',
    body: 'Research happens in the field, with garment workers, urban youth, and rural health communities across Bangladesh.',
  },
  {
    title: 'Publish at top venues',
    body: 'DIAL publishes at CHI, CSCW, UIST, and JMIR. Lab members co-author real papers.',
  },
  {
    title: 'A lab, not a job',
    body: 'Small team, flat hierarchy. Nova works directly with every lab member.',
  },
]

// DIAL has no numbered vacancies to post — it takes graduate and undergraduate
// students year-round, by email. Inventing two "roles" to fill a section made
// the page claim a formal process that does not exist, and that a Lab Editor
// would then have to keep current. What is true is who may write, and about what.
const WHO_SHOULD_WRITE = [
  {
    title: 'Graduate students',
    body: "NSU master's students who want a thesis grounded in fieldwork, or who want to co-author at CHI, CSCW, UIST, or JMIR.",
  },
  {
    title: 'Undergraduate students',
    body: 'Any NSU undergraduate, from any semester. Most lab members started with no research experience at all.',
  },
  {
    title: 'Everyone else',
    body: 'Visiting students, collaborators, and researchers elsewhere in Bangladesh — write anyway, and say what you are working on.',
  },
]

/** The subject line the lab asks for; also pre-filled into the mailto link. */
const SUBJECT = 'Application for DIAL Recruitment [Semester] – Your Name'

/** What goes with the email. Printed as the letter's enclosures. */
const ENCLOSURES = [
  'Your CV',
  'A short research-interest statement',
  'Your current program and year',
  'Any relevant skills or experience',
]

const HOW_TO_APPLY = [
  {
    title: 'Write a short email',
    body: 'Tell us what draws you to HCI research; that matters more than your CV.',
  },
  {
    title: 'Attach the basics',
    body: 'The four enclosures on the letter. Nothing else is required.',
  },
  {
    title: 'Hear back',
    body: 'We read every application and reply to everyone shortlisted within two weeks.',
  },
]

// Captions for the Lab-life photographs DIAL will supply. Until real, consented
// photos exist the slots print riso compositions and the moments are captions:
// a stock photo captioned as a DIAL event would be a fabrication
// (labs/dial/design-principles.md). Each caption describes the slot, never a
// picture that is not there.
const MOMENTS: { title: string; caption: string; art: RisoVariant }[] = [
  {
    title: 'Lab sessions',
    caption: 'Weekly meetings in Dhaka where ideas become research questions.',
    art: 'orbit',
  },
  {
    title: 'Fieldwork',
    caption: 'Research happens where the people are, not in the lab.',
    art: 'field',
  },
  {
    title: 'Iftar together',
    caption: 'Every Ramadan the lab gathers. Research is also relationships.',
    art: 'bloom',
  },
  {
    title: 'Conference trips',
    caption: 'DIAL researchers presenting their work to a global audience.',
    art: 'signal',
  },
  {
    title: 'Research presentations',
    caption: 'Every lab member presents at NSU, from their first semester.',
    art: 'strata',
  },
]

/**
 * Join the lab.
 *
 * The page used to be the same three-column block four times over — reasons,
 * who, life, steps — so nothing on it led. Each section now has its own shape,
 * and the shape is the argument: the reasons are one ruled list you can read
 * down, who may write is the page's single ink band, the application is the
 * actual letter you would send (with the steps drawn beside it as a path), and
 * life at the lab is a contact sheet waiting for its photographs.
 */
export default async function JoinUsPage() {
  const { labInfo } = await getDial()
  const intake = nextIntake(labInfo.recruitment)
  const applyHref = `mailto:${labInfo.email}?subject=${encodeURIComponent(SUBJECT)}`

  return (
    <>
      <ScrollRuler />
      <PageHeader
        eyebrow="Join the lab"
        art="signal"
        title="No prerequisites. Just curiosity."
        description="If you are curious about how technology shapes lives in Bangladesh, and want to do research that matters, DIAL is for you."
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-end gap-3">
            <PrimaryLink href={applyHref}>Apply by email</PrimaryLink>
            {/* Marginalia: the note and arrow are decoration around a real action. */}
            <MarginNote className="pb-1">that is the whole process</MarginNote>
          </div>
          <p className="text-brand inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="bg-brand size-1.5 shrink-0 rounded-full" />
            Open year-round
            {intake && (
              <span className="text-muted-foreground">
                <span aria-hidden className="mr-2 opacity-60">
                  ·
                </span>
                {intake}
              </span>
            )}
          </p>
        </div>
      </PageHeader>

      {/* §1 Why: one ruled list, read top to bottom, with the field's own
          history pencilled in the margin beside the claim it backs. */}
      <section className={cn('container', sectionSpacing, 'pt-0 md:pt-0')}>
        <SectionHeader
          label="Why DIAL"
          title="Research that reaches the people who need it most"
          className="mb-8"
        />
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
          <ol className="divide-y divide-border border-y border-border">
            {REASONS.map((reason, i) => (
              <li
                key={reason.title}
                className="grid grid-cols-[2.25rem_1fr] gap-x-4 py-6 md:grid-cols-[3rem_16rem_1fr] md:gap-x-8"
              >
                <span className="font-hand text-ink text-3xl leading-none tabular-nums">
                  {i + 1}
                </span>
                <h3 className="font-display text-2xl leading-snug">{reason.title}</h3>
                <p className="col-start-2 mt-2 text-pretty text-muted-foreground md:col-start-3 md:mt-1">
                  {reason.body}
                </p>
              </li>
            ))}
          </ol>
          {/* "No prerequisites" is the page's central claim and the hardest one
              for a student to believe. The field's own history is the evidence. */}
          <FieldNote source="CHI, first held 1982" className="lg:sticky lg:top-28 lg:self-start">
            The people who built HCI arrived from psychology, theatre, design and anthropology at
            least as often as from computer science. It has never been a field you need permission
            to enter.
          </FieldNote>
        </div>
      </section>

      {/* §2 Who may write: the page's one full-bleed moment. The claim is set
          at pull-quote size; the three kinds of reader follow as a ruled index
          inside the band rather than as three more columns. */}
      <InkBand>
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          <TickMark />
          Who we take
        </p>
        <p className="font-display mt-6 max-w-4xl text-4xl leading-[1.05] text-balance md:text-6xl">
          The lab is open year-round. There is no vacancy list to wait for.
        </p>
        <dl className="mt-12 max-w-4xl divide-y divide-(--header-ink)/25 border-y border-(--header-ink)/25">
          {WHO_SHOULD_WRITE.map((who) => (
            <div
              key={who.title}
              className="grid gap-x-8 gap-y-1 py-5 md:grid-cols-[14rem_1fr] md:items-baseline"
            >
              <dt className="font-display text-2xl">{who.title}</dt>
              <dd className="text-pretty text-foreground/75">{who.body}</dd>
            </div>
          ))}
        </dl>
      </InkBand>

      {/* §3 How to apply: the letter itself, and the path it takes. */}
      <section className={cn('container', sectionSpacing)}>
        <SectionHeader label="How to apply" title="One email, no forms" className="mb-10" />
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
          <ApplicationLetter to={labInfo.email ?? ''} />
          <ApplyPath />
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
          <PrimaryLink href={applyHref}>Write the email</PrimaryLink>
          <TextLink href="/contact" className="text-muted-foreground hover:text-foreground">
            Questions? Contact the lab
          </TextLink>
        </div>
      </section>

      {/* §4 Life at DIAL: a contact sheet. Each frame is a real slot for the
          lab's own photograph; until one arrives it prints a composition, and
          the caption says what belongs there. */}
      <section className={cn('container', sectionSpacing, 'pt-0 md:pt-0')}>
        <SectionHeader
          label="Life at DIAL"
          title="What it is like to work here"
          className="mb-10"
        />
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 md:gap-x-8 lg:grid-cols-6">
          {MOMENTS.map((moment, i) => (
            <li
              key={moment.title}
              className={cn(
                // Two wide frames over three narrow ones on desktop; on a phone
                // the first runs full width and the rest pair up.
                i < 2 ? 'lg:col-span-3' : 'lg:col-span-2',
                i === 0 && 'col-span-2',
              )}
            >
              <PhotoSlot
                alt={moment.title}
                art={moment.art}
                // Frames that share a row share a shape: the lead frame is wide
                // everywhere, the rest are portrait while paired on a phone.
                aspect={
                  i === 0
                    ? 'aspect-16/10'
                    : i === 1
                      ? 'aspect-4/5 lg:aspect-16/10'
                      : 'aspect-4/5 lg:aspect-4/3'
                }
              />
              <p className="font-display mt-3 text-lg leading-snug md:text-xl">{moment.title}</p>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">{moment.caption}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

/**
 * The application as the letter itself: headers, the opening line, the
 * enclosures. A list of instructions about an email is harder to follow than
 * the email, so the page prints one, with the parts a student fills in written
 * by hand in the second ink.
 */
function ApplicationLetter({ to }: { to: string }) {
  const field = 'grid grid-cols-[4.5rem_1fr] gap-3 border-b border-paper-line py-2.5'
  const fieldLabel = 'font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase'
  return (
    <figure className="relative">
      <div className="relative rounded-sm border border-border bg-card px-6 pt-8 pb-10 shadow-[0_1px_0_0_var(--paper-line),0_18px_40px_-28px_rgba(0,0,0,0.5)] md:px-10">
        <CropMarks className="text-ink/40 top-4" />
        <Tape />
        <div className="text-sm">
          <div className={field}>
            <span className={fieldLabel}>To</span>
            <span className="break-all">{to}</span>
          </div>
          <div className={field}>
            <span className={fieldLabel}>Subject</span>
            <span className="text-pretty">
              Application for DIAL Recruitment{' '}
              <span className="font-hand text-ink text-lg leading-none">[Semester]</span> –{' '}
              <span className="font-hand text-ink text-lg leading-none">Your Name</span>
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4 leading-relaxed text-pretty">
          <p>Dear DIAL,</p>
          <p className="font-hand text-ink text-xl leading-snug">
            What draws me to HCI research is…
          </p>
          <p className="text-muted-foreground">
            A few honest lines about the question you would like to work on. This matters more than
            your CV.
          </p>
        </div>

        <div className="mt-8 border-t border-dashed border-border pt-5">
          <p className="font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
            Enclosed
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ENCLOSURES.map((item) => (
              <li
                key={item}
                className="border-ink/30 bg-ink/6 rounded-[0.35rem] border px-2.5 py-1 text-xs"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption className="sr-only">
        The application email: to {to}, subject “{SUBJECT}”, with your CV, a research-interest
        statement, your program and year, and any relevant skills.
      </figcaption>
    </figure>
  )
}

/**
 * The three steps as a path drawn down the margin: numbered stations joined by
 * a dotted pencil line, so the sequence reads as one journey rather than three
 * equal boxes.
 */
function ApplyPath() {
  return (
    <ol className="relative flex flex-col gap-10 self-start">
      {/* The thread between the stations, behind them. */}
      <span
        aria-hidden
        className="border-ink/45 absolute top-5 bottom-5 left-[1.1875rem] w-0 border-l-2 border-dotted"
      />
      {HOW_TO_APPLY.map((step, i) => (
        <li key={step.title} className="relative grid grid-cols-[2.5rem_1fr] gap-4">
          <span className="border-ink/50 font-hand text-ink relative grid size-10 place-items-center rounded-full border-2 bg-background text-2xl leading-none">
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="font-display text-xl leading-snug">{step.title}</h3>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
