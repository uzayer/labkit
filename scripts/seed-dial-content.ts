/**
 * One-off: copy the Lab content DIAL's frontend hardcodes into the fields the
 * 20261104 features_and_lab_content migration added, and switch every Feature on.
 *
 * Run: bun run payload -- run scripts/seed-dial-content.ts [dry-run] [force]
 *
 * - LabInfo: `headline`, `intro`, `about`, `joinUs`.
 * - ResearchThemes: `body` for DIAL's nine themes, matched by slug.
 * - Features: every Feature on, only if the global has never been saved. The
 *   migration already carries over LabInfo's old toggles where a row existed.
 *
 * Fills empty fields only, so a re-run never overwrites a Lab Editor's edits;
 * `force` overwrites them. `dry-run` prints what would change and writes nothing.
 * The text is copied verbatim from the (dial) routes as of 2026-11-04, except
 * where those pages interpolate live figures (noted inline).
 */
import { getPayload } from 'payload'
import config from '@payload-config'

const args = new Set(process.argv.slice(2))
const dryRun = args.has('dry-run')
const force = args.has('force')

// ─── Lexical ────────────────────────────────────────────────────────────────
// The root editor has headings, paragraphs and inline formatting only (no lists
// or quotes), so the copy is built from those.

const ITALIC = 2

const text = (value: string, format = 0) => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

const block = { direction: 'ltr', format: '', indent: 0, version: 1 } as const

const p = (value: string, format = 0) => ({
  type: 'paragraph',
  ...block,
  textFormat: format,
  children: [text(value, format)],
})

const h = (tag: 'h2' | 'h3', value: string) => ({
  type: 'heading',
  tag,
  ...block,
  children: [text(value)],
})

const doc = (children: object[]) => ({ root: { type: 'root', ...block, children } })

/** A heading per item with its paragraph under it. */
const items = (list: { title: string; body: string }[]) =>
  list.flatMap(({ title, body }) => [h('h3', title), p(body)])

// ─── LabInfo ────────────────────────────────────────────────────────────────

// (dial)/page.tsx — the home hero.
const headline = 'Technology for communities design usually misses.'
const intro =
  'DIAL studies how people live with technology in low-resource, high-stakes settings, then builds inclusive systems with the communities who will use them.'

// (dial)/about/page.tsx. The page fills in the founding year (2020) and the
// year NSUHCI began HCI research (2017) from data; they're written out here.
const about = doc([
  h('h2', 'Research that treats constraints as design material.'),
  p(
    'DIAL—the Design Inclusion and Access Lab at North South University—was established in 2020 by NSUHCI, the HCI research group Dr. Nova Ahmed and her colleagues began in 2017 through a collaboration with Google. We are based in the Department of Electrical and Computer Engineering.',
  ),
  p(
    'Our research focuses on inclusivity and access for marginalised communities, building technology that is locally appropriate, low-cost, and explainable. We use participatory design and long-term fieldwork to understand problems from the inside, then build and evaluate technology with the people who will use it.',
  ),
  p(
    'We collaborate across universities, funders, and partners to study inclusion, safety, wellbeing, and development, always with attention to constraints like language, bandwidth, devices, and trust.',
  ),
  h('h2', 'What the lab holds to'),
  ...items([
    {
      title: 'Participation over prescription',
      body: 'We design with communities, not for them. Every project begins with fieldwork — listening before building.',
    },
    {
      title: 'Constraints as design material',
      body: 'Low bandwidth, limited literacy, affordable hardware. We treat the real conditions of our users as the starting point, not an afterthought.',
    },
    {
      title: 'Rigour from the margins',
      body: 'HCI from Bangladesh can set the agenda. Our work surfaces problems — and solutions — that richer contexts miss.',
    },
    {
      // The page opens this with a live count of researchers mentored; a stored
      // copy would go stale, so the sentence is rephrased without it.
      title: 'Mentorship as mission',
      body: 'Researchers mentored here since 2017 have gone on to PhD programmes at Cardiff, Ohio State, UMass, and VU Amsterdam. The lab is a launchpad.',
    },
  ]),
  h('h2', 'From field insight to usable systems'),
  ...items([
    {
      title: 'Fieldwork first',
      body: 'Projects begin with interviews, visits, workshops, and patient listening before a tool is proposed.',
    },
    {
      title: 'Prototype with communities',
      body: 'Ideas are made tangible early, then reshaped through feedback from the people expected to use them.',
    },
    {
      title: 'Publish and deploy',
      body: 'The lab turns findings into papers, systems, methods, and student research trajectories.',
    },
  ]),
  h('h2', 'How DIAL got here'),
  ...items([
    {
      title: '2017 · HCI research begins',
      body: 'NSUHCI starts focusing on HCI research at North South University through a collaboration with Google.',
    },
    {
      title: '2019 · Global HCI recognition',
      body: 'Community-centered safety and inclusion work earns attention at leading HCI venues.',
    },
    {
      title: '2020 · DIAL founded',
      body: 'NSUHCI establishes DIAL, the Design Inclusion and Access Lab, focused on technology design, inclusion, and access.',
    },
    {
      title: '2024 · Broader research platform',
      body: 'The lab now spans accessibility, ICTD, mental health, explainable AI, safety, and education.',
    },
  ]),
])

// (dial)/join-us/page.tsx. The apply link and recruitment window come from
// LabInfo's email and recruitment fields, so they aren't repeated here.
const joinUs = doc([
  h('h2', 'No prerequisites. Just curiosity.'),
  p(
    'If you are curious about how technology shapes lives in Bangladesh, and want to do research that matters, DIAL is for you.',
  ),
  h('h2', 'Research that reaches the people who need it most'),
  ...items([
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
  ]),
  h('h2', 'Who we take'),
  p('The lab is open year-round. There is no vacancy list to wait for.'),
  ...items([
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
  ]),
  h('h2', 'One email, no forms'),
  ...items([
    {
      title: 'Write a short email',
      body: 'Tell us what draws you to HCI research; that matters more than your CV.',
    },
    {
      title: 'Attach the basics',
      body: 'Your CV, a short research-interest statement, your current program and year, and any relevant skills or experience. Nothing else is required.',
    },
    {
      title: 'Hear back',
      body: 'We read every application and reply to everyone shortlisted within two weeks.',
    },
  ]),
  p('Subject line: Application for DIAL Recruitment [Semester] – Your Name', ITALIC),
])

// ─── Research Themes ────────────────────────────────────────────────────────
// (dial)/research/<slug>/page.tsx: the description, then the "stakes" prose
// (plainly, why), then the margin note with its source.

const THEMES: {
  slug: string
  description: string
  plainly: string
  why: string
  note: string
  source: string
}[] = [
  {
    slug: 'accessibility-inclusion',
    description:
      'DIAL investigates how people with disabilities, low literacy, and other barriers navigate technology — and designs systems that include them rather than assume them away. Work spans assistive technology for visually impaired people, low-cost wearables for stroke rehabilitation, and tools for children with autism and their caregivers.',
    plainly:
      'Accessibility research asks a blunt question: when a system assumes someone who can see the screen, read the label, tap accurately, and afford a recent phone, what happens to everyone else?',
    why: 'Those assumptions fail often here, and they fail quietly. An interface never announces that it has excluded someone — the person simply stops using it, and the exclusion leaves no trace in the usage data. DIAL starts from the people the defaults leave out: blind and low-vision users, people who do not read fluently, patients recovering from stroke, children with autism and the carers around them. Designing from their constraints is not the same as retrofitting for them afterwards, and the two rarely produce the same system.',
    note: 'The dropped kerb was won by disabled activists in Berkeley in the 1970s. It is now used by anyone pushing a pram, a suitcase or a delivery trolley — the standard evidence that designing for the excluded improves the thing for everybody.',
    source: 'The curb-cut effect',
  },
  {
    slug: 'computing-education-community',
    description:
      'DIAL works to broaden participation in computing in Bangladesh — through curriculum research, community building for women in tech, and studies of how students learn programming in under-resourced universities. Work also covers mentorship structures and retention in CS degree programmes.',
    plainly:
      'This is research on who gets to build computing — which is a different question, with a different answer, from who turns out to be good at it.',
    why: "Who ends up in a computing programme is largely settled before any aptitude is measured: by which school had a working lab, whose family could spare the fees, who was permitted to travel to class, and who ever saw someone like themselves doing the work. DIAL's work here is on widening that entry in Bangladesh, and on the teaching and community structures that decide whether people stay once they have arrived — which is the half of the problem that recruitment drives consistently miss.",
    note: 'The share of American computing degrees awarded to women peaked in 1984, at roughly 37%, then fell for two decades. Nothing about the discipline got harder that year; what changed, the standard account argues, is who the home computer was sold to.',
    source: 'US federal degree data · Margolis & Fisher, 2002',
  },
  {
    slug: 'explainable-ai-ml',
    description:
      'DIAL investigates how AI systems can be made interpretable, auditable, and trustworthy — especially in high-stakes domains like health. Work spans explainable machine learning for detecting depression and other psychological problems, deepfake and medical-image detection, and AI ethics for Bangladesh.',
    plainly:
      'Explainability is the question of whether a system can say why — in terms the person affected by the decision can actually use.',
    why: "An accuracy score is a claim made to the people who built the model. It is not an answer to a patient told that a scan looks abnormal, or to anyone told that an automated decision has gone against them. Where a decision arrives with no explanation and no route of appeal, the system has stopped being a tool and become a verdict. DIAL's work is on making algorithmic systems legible to non-experts — including the communities those systems are used on, who are rarely the ones shown the evaluation.",
    note: "The phrase 'explainable AI' spread through DARPA's XAI programme in 2016, but the problem is older: medical expert systems in the 1970s already had to justify their diagnoses, because doctors would not act on an answer that arrived without a reason.",
    source: 'DARPA XAI, 2016 · MYCIN, 1970s',
  },
  {
    slug: 'gender-feminist-hci',
    description:
      'DIAL examines how gender shapes technology design, use, and harm — and builds interventions grounded in feminist and intersectional frameworks. Work includes digital safety for women, gendered experiences of social media, and feminist participatory design methods.',
    plainly:
      'Feminist HCI is not research about women. It is the practice of asking, of any system, whose experience it was built around — and who absorbs the cost when that guess is wrong.',
    why: 'Harassment, monitoring, and loss of privacy are not edge cases in the technology women use in Bangladesh; they are ordinary conditions of use. A safety feature designed for someone with a private phone and a supportive household does very little for someone whose device is shared and whose movements are watched. That is why this work is done with the women who will use the system rather than for them: the constraints that decide whether a design works are not visible from outside them.',
    note: "Shaowen Bardzell named feminist HCI as a field at CHI in 2010, arguing that design's claim to neutrality is itself a design decision — one usually made on behalf of whoever the designers most resemble.",
    source: 'Bardzell, CHI 2010',
  },
  {
    slug: 'ictd',
    description:
      "DIAL builds and evaluates technology interventions for underserved communities across the Global South — from Rohingya refugee health to garment workers' lives and women's financial inclusion. Work is grounded in long-term fieldwork and co-design with the communities themselves.",
    plainly:
      'ICTD — information and communication technologies for development — studies what actually happens when technology designed in one part of the world is deployed in another.',
    why: 'The gap is rarely the hardware. It is language, literacy, bandwidth, cost per megabyte, who in a household owns the phone and who is allowed to use it, and whether the institution behind a service is trusted at all. A design that ignores those does not fail loudly — it is simply not adopted, and the non-adoption is then explained away as a problem with the users. DIAL treats those conditions as the design brief rather than as friction to be overcome.',
    note: "Kentaro Toyama's law of amplification: technology amplifies existing human intent and capacity, it does not substitute for them. A working school gets better with computers. A broken one gets more broken, faster.",
    source: 'Toyama, Geek Heresy, 2015',
  },
  {
    slug: 'infodemic-misinformation',
    description:
      'DIAL studies how information — and its suppression — moves through communities in Bangladesh, from risk communication during and after COVID-19 to the digital silence around student protests, and designs responses grounded in local trust.',
    plainly:
      'Misinformation research is less about what is false than about why a false thing travels — who passes it on, and what they are right about that the correction gets wrong.',
    why: 'Health rumours move through the same channels as trustworthy advice: family groups, neighbours, a pharmacist, a religious leader. A correction arriving from outside those channels, in the wrong language or the wrong register, does not land — and repeating a false claim in order to debunk it can carry it further than it would have gone. DIAL studies how this information moves in Bangladesh, and builds responses on the trust that already exists rather than on the assumption that facts win by themselves.',
    note: "'Infodemic' was coined by David Rothkopf in a 2003 newspaper column about SARS. It sat unused for seventeen years until the WHO revived it in February 2020 — before most countries had recorded a single COVID case.",
    source: 'Rothkopf, 2003 · WHO, 2020',
  },
  {
    slug: 'iot-low-cost-hardware',
    description:
      'DIAL designs affordable sensor platforms and IoT systems for communities with limited infrastructure. Work ranges from distributed sensing for flash floods to low-cost wearables for driver stress and stroke rehabilitation.',
    plainly:
      'This is the unglamorous half of computing research: what a sensor costs, whether it survives the monsoon, and who can repair it when it fails.',
    why: "A prototype that works in a lab and costs more than a month's income is a demonstration, not an intervention. Infrastructure here is intermittent by default — power, connectivity, and the supply of spare parts all are — so a device's real specification includes its price, its repairability, and what it does once the network is gone. DIAL builds affordable sensing for exactly those conditions, which is a harder engineering problem than the expensive version, not an easier one.",
    note: "Kevin Ashton coined 'the Internet of Things' in 1999 for a talk at Procter & Gamble. As he tells it, the subject was a shade of lipstick that kept going out of stock, and the fix was a radio tag.",
    source: 'Ashton, 1999',
  },
  {
    slug: 'mental-health-wellbeing',
    description:
      'DIAL designs and evaluates digital tools for mental health support in contexts where formal psychiatric care is scarce. Work spans smartphone-based sensing of depression among students, chatbots for university students, and support for physicians and people with disabilities.',
    plainly:
      'Digital mental health research asks what technology can honestly do where professional care is scarce — and, just as importantly, what it must never pretend to do.',
    why: "Most wellbeing apps assume someone who can already name what they are feeling, who has privacy on their own device, and who has a clinician to escalate to. Remove any one of those and the design does not merely underperform; it can do harm. DIAL's work is on tools and methods for care in settings where clinical infrastructure is thin and stigma is real — which means designing around disclosure, around families rather than individuals, and around the limits of what software should ever claim to be.",
    note: 'Joseph Weizenbaum wrote ELIZA in 1966 as a parody of a therapist. People confided in it anyway — his own secretary asked him to leave the room — and he spent the rest of his career arguing against what he had built.',
    source: 'Weizenbaum, ELIZA, 1966',
  },
  {
    slug: 'safety-security',
    description:
      'DIAL studies how vulnerable populations experience digital and physical threats — harassment, privacy loss on shared phones, and online risks for teenagers — and builds protective tools grounded in their threat models, from the Protibadi wearable to privacy research with women across South Asia.',
    plainly:
      'Safety research asks who a system protects and from whom — questions with very different answers for someone whose threat is a stranger and someone whose threat shares their home.',
    why: 'Standard security models assume the attacker is remote and the device is yours. A great deal of real harm fits neither: the phone is shared, the passcode is known to family, and the risk of being seen using a safety tool can exceed the risk it was built to address. DIAL co-designs protective systems with people living in those conditions, because a tool that cannot be used discreetly will not be used at all — and a safety feature nobody dares open is indistinguishable from no safety feature.',
    note: "Kerckhoffs's principle, 1883: a system must stay secure even when everything about it is public — everything except the key. A tool whose mere presence on a phone is dangerous has no key left to keep.",
    source: 'Kerckhoffs, 1883',
  },
]

const themeBody = (theme: (typeof THEMES)[number]) =>
  doc([
    p(theme.description),
    p(theme.plainly),
    p(theme.why),
    p(`${theme.note} — ${theme.source}`, ITALIC),
  ])

// ─── Run ────────────────────────────────────────────────────────────────────

const isEmpty = (value: unknown) =>
  value == null ||
  value === '' ||
  (typeof value === 'object' &&
    ((value as { root?: { children?: unknown[] } }).root?.children?.length ?? 0) === 0)

// revalidateTag throws outside a Next.js request; the hooks skip it on this flag.
const context = { disableRevalidate: true }

async function main() {
  const payload = await getPayload({ config })
  const log = (msg: string) =>
    payload.logger.info(`[seed-dial-content]${dryRun ? ' (dry run)' : ''} ${msg}`)

  // Features
  const features = await payload.findGlobal({ slug: 'features', depth: 0, overrideAccess: true })
  if (!features.updatedAt || force) {
    log('Features: switching every Feature on')
    if (!dryRun) {
      await payload.updateGlobal({
        slug: 'features',
        data: { projects: true, grants: true, awards: true, newsItems: true, researchThemes: true },
        overrideAccess: true,
        context,
      })
    }
  } else {
    log('Features: already saved, left as is')
  }

  // LabInfo
  const labInfo = await payload.findGlobal({ slug: 'lab-info', depth: 0, overrideAccess: true })
  const content = { headline, intro, about, joinUs }
  const labInfoData = Object.fromEntries(
    Object.entries(content).filter(
      ([key]) => force || isEmpty(labInfo[key as keyof typeof labInfo]),
    ),
  )
  const skipped = Object.keys(content).filter((key) => !(key in labInfoData))
  log(
    `LabInfo: setting ${Object.keys(labInfoData).join(', ') || 'nothing'}${skipped.length ? `; already set: ${skipped.join(', ')}` : ''}`,
  )
  if (!dryRun && Object.keys(labInfoData).length > 0) {
    await payload.updateGlobal({
      slug: 'lab-info',
      data: labInfoData,
      overrideAccess: true,
      context,
    })
  }

  // Research Themes
  for (const theme of THEMES) {
    const { docs } = await payload.find({
      collection: 'research-themes',
      where: { slug: { equals: theme.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const record = docs[0]
    if (!record) {
      log(`Research Theme ${theme.slug}: not found, skipped`)
      continue
    }
    if (!force && !isEmpty(record.body)) {
      log(`Research Theme ${theme.slug}: body already set`)
      continue
    }
    log(`Research Theme ${theme.slug}: setting body`)
    if (!dryRun) {
      await payload.update({
        collection: 'research-themes',
        id: record.id,
        data: { body: themeBody(theme) as never },
        overrideAccess: true,
        context,
      })
    }
  }

  log('Done')
}

await main()
process.exit(0)
