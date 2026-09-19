import type { Award, PersonRef } from './types'

/**
 * Awards (recognition, not funding — money-bearing "awards" are Grants).
 *
 * `scope: 'lab'` is used for awards the Lab itself claims: the NSU HCI Awards
 * page ("Paper Awards") and the DIAL Proposal's "Awards" list. Awards that
 * appear only on Dr. Nova Ahmed's personal site, or that are personal by nature
 * (scholarships, fellowships), are `scope: 'personal'`; they belong on her
 * profile, not the Lab's Awards page. Both scopes need DIAL confirmation.
 *
 * Recipients are Team Member ids only for exact-name matches; everyone else is
 * a Custom Author. `featured` carries over the prototype's editorial choice.
 */
const NSU_AWARDS = 'nsu-hci-current-website/awards.md — "Paper Awards"'
const PROPOSAL_AWARDS = 'DIAL Proposal.md — "Awards"'
const NOVA_AWARDS = 'nova-ahmed-personal-site/awards.md — "Awards"'

const custom = (...names: string[]): { customRecipient: PersonRef }[] =>
  names.map((name) => ({ customRecipient: { name } }))

const nova = [{ teamMember: 'nova-ahmed' }]

export const awards: Award[] = [
  // ─── Lab-claimed ────────────────────────────────────────────────────────────
  {
    id: 'soups-2024-ten-year-impact-award',
    title: '10 Years Impact Award',
    year: 2024,
    category: 'impact',
    scope: 'lab',
    // The Proposal names no recipient or paper for this award.
    recipients: [],
    organizationLabel: 'SOUPS (USENIX)',
    featured: true,
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL_AWARDS} ("10 years Impact Award: SOUPS Usenix Conference (2024)")`,
    },
  },
  {
    id: 'compass-2023-best-paper',
    title:
      'Best Paper Award — Making ethics at home in Global CS Education: Provoking stories from the Souths',
    year: 2023,
    category: 'best-paper',
    scope: 'lab',
    recipients: [
      { teamMember: 'nova-ahmed' },
      ...custom(
        'Cat Kutay',
        'Shaimaa Lazem',
        'Marisol Wong-Villacres',
        'Cristina Abad',
        'Cesar Collazos',
        'Shady Elbassuoni',
      ),
      { teamMember: 'lamia-iftekhar' },
      ...custom('Farzana Islam', 'Deepa Singh'),
      { teamMember: 'tahsin-mayeesha' },
      ...custom('Martin Ujakpamabeifam', 'Tariq Zaman', 'Nicola Bidwell'),
    ],
    organizationLabel: 'ACM COMPASS 2023 (ACM Journal on Computing and Sustainable Societies)',
    featured: true,
    provenance: {
      source: 'scrape',
      sourceNote: `${NSU_AWARDS} → "ACM Journal on Computing and Sustainable Societies (COMPASS 2023) Best Paper"; "Best Journal Paper Award" in ${PROPOSAL_AWARDS}. Tahsin Mayeesha is listed as "Tasmiah Tahsin Mayeesha".`,
    },
  },
  {
    id: 'chi-2019-best-paper',
    title:
      'Best Paper Award (Best of CHI) — "They Don’t Leave Us Alone Anywhere We Go": Gender and Digital Abuse in South Asia',
    year: 2019,
    category: 'best-paper',
    scope: 'lab',
    recipients: [
      { teamMember: 'nithya-sambasivan' },
      ...custom('A. Batool'),
      { teamMember: 'nova-ahmed' },
      ...custom(
        'T. Matthews',
        'K. Thomas',
        'L. Gaytán-Lugo',
        'D. Nemer',
        'E. Bursztein',
        'E. Churchill',
        'S. Consolvo',
      ),
    ],
    organizationLabel: 'ACM CHI 2019',
    featured: true,
    provenance: {
      source: 'scrape',
      sourceNote: `${NSU_AWARDS} → "CHI 2019 Best Paper"; also ${PROPOSAL_AWARDS}`,
    },
  },
  {
    id: 'comsnets-2019-best-poster',
    // Conflict: awards.md heads it "Best Short Paper" and says "Best Award"; the
    // Proposal, the personal site, and an events.md photo caption say "Best
    // Poster Award". The majority label is used.
    title: 'Best Poster Award — Monitoring Driving Stress using HRV',
    year: 2019,
    category: 'best-poster',
    scope: 'lab',
    recipients: [{ teamMember: 'rahat-jahangir-rony' }, { teamMember: 'nova-ahmed' }],
    organizationLabel: 'COMSNETS 2019',
    provenance: {
      source: 'scrape',
      sourceNote: `${NSU_AWARDS} → "COMSNETS 2019 Best Short Paper"; ${PROPOSAL_AWARDS}; nsu-hci-current-website/events.md — "COMSNETS 2019" photo caption`,
    },
  },
  {
    id: 'soups-2018-iapp-distinguished-privacy-award',
    title:
      'IAPP Distinguished Privacy Award — "Privacy is not for me, it’s for those rich women": Performative Privacy Practices on Mobile Phones by Women in South Asia',
    year: 2018,
    category: 'recognition',
    scope: 'lab',
    recipients: [
      { teamMember: 'nithya-sambasivan' },
      ...custom('G. Checkley', 'A. Batool'),
      { teamMember: 'nova-ahmed' },
      ...custom('D. Nemer', 'L. Gaytán-Lugo', 'T. Matthews', 'S. Consolvo', 'E. Churchill'),
    ],
    organizationLabel: 'IAPP / SOUPS 2018',
    featured: true,
    provenance: {
      source: 'scrape',
      sourceNote: `${NSU_AWARDS} → "Soups 2018: IAPP Distinguished Privacy Award"`,
    },
  },
  {
    id: 'hcixb-2018-best-poster',
    title: 'Best Poster Award — Supporting Missing Daughters',
    year: 2018,
    category: 'best-poster',
    scope: 'lab',
    recipients: [
      { teamMember: 'nova-ahmed' },
      { teamMember: 'tamanna-motahar' },
      ...custom('Sharmin Kabir'),
      { teamMember: 'munir-hasan' },
    ],
    organizationLabel: 'HCI Across Borders, CHI 2018',
    provenance: {
      source: 'scrape',
      sourceNote: `${NSU_AWARDS} → "CHI HCIxB Symposium 2018 Best Poster"`,
    },
  },
  {
    id: 'iqac-2021-research-award',
    title: 'IQAC Research Award',
    year: 2021,
    category: 'recognition',
    scope: 'lab',
    recipients: nova,
    organizationLabel: 'IQAC',
    provenance: { source: 'scrape', sourceNote: `${PROPOSAL_AWARDS}; ${NOVA_AWARDS}` },
  },
  {
    id: 'icaist-2020-best-paper',
    title: 'Best Paper Award',
    year: 2020,
    category: 'best-paper',
    scope: 'lab',
    recipients: nova,
    organizationLabel: 'ICAIST',
    provenance: { source: 'scrape', sourceNote: `${PROPOSAL_AWARDS}; ${NOVA_AWARDS}` },
  },

  // ─── Personal (Dr. Nova Ahmed) ─────────────────────────────────────────────
  {
    id: 'ghc-2019-faculty-scholar',
    title: 'Grace Hopper Conference for Women in Computing, Faculty Scholar',
    year: 2019,
    category: 'scholarship',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'Grace Hopper Conference for Women in Computing',
    provenance: { source: 'scrape', sourceNote: `${NOVA_AWARDS}; also ${PROPOSAL_AWARDS}` },
  },
  {
    id: 'south-asian-feminist-course-2019-fellowship',
    title:
      'Fellowship, XXIV South Asian Feminist Capacity Building Course on Gender, Sustainable Livelihoods, Human Rights and Peace',
    year: 2019,
    category: 'fellowship',
    scope: 'personal',
    recipients: nova,
    provenance: { source: 'scrape', sourceNote: `${NOVA_AWARDS}; also ${PROPOSAL_AWARDS}` },
  },
  {
    id: 'ingsa-asia-2021-honorable-mention',
    title: 'INGSA_Asia Essay Contest 2020, Honorable Mention',
    year: 2021,
    category: 'honorable-mention',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'INGSA_Asia',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'col-grow-with-google-2021-scholarship',
    title: 'Commonwealth of Learning Grow with Google Skill Development Scholarship',
    year: 2021,
    category: 'scholarship',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'Commonwealth of Learning',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'gestc-2014-best-paper',
    title: 'Best Paper Award',
    year: 2014,
    category: 'best-paper',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'Global Engineering, Science and Technology Conference',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'ghc-2013-new-investigators-award',
    title:
      'New Investigators Award — Gradient Sensor Middleware System design for Flash Flood prone River banks in Bangladesh',
    year: 2013,
    category: 'recognition',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'Grace Hopper Celebration for Women in Computing',
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA_AWARDS}; paper title and "USD 1000" from nova-ahmed-personal-site/research-project-shonabondhu.md`,
    },
  },
  {
    id: 'gtric-2010-finalist',
    title: 'Finalists in the Georgia Tech Research and Innovation Competition',
    year: 2010,
    category: 'competition',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'GTRIC',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'assets-2009-src-second-place',
    title: 'ACM Student Research Competition Award, 2nd Place Winner',
    year: 2009,
    category: 'competition',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'ASSETS',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'upe-2009-essay-competition',
    title: 'Essay Competition Winner',
    year: 2009,
    category: 'competition',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'Upsilon Pi Epsilon',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'acm-w-2010-scholarship',
    title: 'ACM-W Scholarship Recipient',
    // Captured as "Spring 2010, Fall 2007"; `year` holds the later term.
    year: 2010,
    category: 'scholarship',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'ACM-W',
    provenance: { source: 'scrape', sourceNote: `${NOVA_AWARDS} ("Spring 2010, Fall 2007")` },
  },
  {
    id: 'du-2002-deans-honour',
    title: 'Deans Honour',
    year: 2002,
    category: 'recognition',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'University of Dhaka',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'du-talent-pool-scholarship',
    title: 'Talent pool Scholarship',
    year: 1995,
    endYear: 2000,
    category: 'scholarship',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'University of Dhaka',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'acm-icpc-1999',
    title: '6th position, Dhaka University Team',
    year: 1999,
    category: 'competition',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'ACM ICPC',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
  {
    id: 'ncpc-1998',
    title: '3rd Position, Dhaka University Team',
    year: 1998,
    category: 'competition',
    scope: 'personal',
    recipients: nova,
    organizationLabel: 'NCPC',
    provenance: { source: 'scrape', sourceNote: NOVA_AWARDS },
  },
]
