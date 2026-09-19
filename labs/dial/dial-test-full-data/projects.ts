import type { Project } from './types'

/** Hero images: the first image on each personal-site project page, or its thumbnail on the Research index. */
const IMG = {
  shondhi:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQW_h1f4kgxVuyfyq68lZx0N3jiPWBdPz8s8Uk6e5aekdbP61MXEYhZwevcFjpoGmwzupVn4Py7V0Xs8ENrYyye-SlwrP3MlQS9ZESWJwQ2d9B4PkDMbE4KAHl35r9C5PS75o9UbgWPEfRR_CY67dJ0gzmeiWFdAgd2ZZX0lz7fBWKUQwWTsS6HbmsrOBo3OZuC1YMz2oKdMwkMjqZM51LubVevNLiySX2UaD0zsC8I=w1280',
  shonabondhu:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQVFwJjB7At2-sfJzVxxb0F9NrgXCOvyr5bomB4sIqYKetg532dQMdvN8EP6hFk94jzkQ2HH1ETz3wjmZPXDnaRG2X648VehZxTNLMBnrZEdCeVvGF9fRJkwNOcS_rO27jbNyT27Xce9Wst9CibqMwUN69PxyCbMkKoQ9ZkQXWnzuEycbnnvOr3hVc7KeBsxdYLG5xHr-CIrmVFVJ_5lOtqv4jPJ7r0U6IBB1o9XrJs=w1280',
  protibadi:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQVlXLLBpWY2RjjuuyqcOc_7q4wJr7HlCg_7AgAfNjEGEAeE6F4dVkSVIjrI97pGoMrKzeDsbjlqvmmO3yGwzR29rcITv2EcSvh71JZhFnRhdfT6D3rEYuxkDmVBmhGrfPeXx-vDzeGs75hwEjTIC3eiANWR7qioz5FW5-WTJwf-9IXgpbKNGTdVGnbrMmRmOEV_82Dd_HxrMvoiUmkZF4AhEk-g_Eg3iM2fr2pX=w1280',
  monMajhi:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQXRxpt7bPMa1TlMlQASze6XwXskDJguwpZnEkFaqSiJpVhLh-RjA_F7qA1QoR1OQggT-sLPActAf_2U8bDy8npGyUlnF_QBzW5Eudl0cwQNJbvHgMDm_0A11K6sWKGq4-DRqhEjRLnjYfV0jVmkHD97zOMkpF3-4UWhfy0RqNQSmlIhvR9XrbNxsBGuVG8w1bfvGXmO4SOcKm59Y3HP4hu2xdyv3_-eBFzXlC9OXE4=w1280',
  bapReBap:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQXIbNVdAAIkBUleacWQRhFmlb04HmrquO1Oxx0ZgpmcDJOISLMxR-TnkvZZodqn7c7v1zc_5iKoNG8FQwol99HwqI7CzhOAru32cCNB4hLUJyeXUbu6T2pFH0MK_I7rEgotxohZbK2ynyoqnxhhtkjEohfo0hy1IGp6Xq2LEdu57zTxgIUGh6nMizO_5r5D9T356RQKdrZ0P2-iUWL4A8fMNVp2LFhoysmgalJR3GI=w1280',
  tuntuni:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQWCgAMPTM3fP0TeRsw1tAtDcu6JvI8TlYS3jfqgmELRKDWN3I4dFF4Y8heUs24UtThznrnQhjhwBUxHPQK3H0RtI4cMZXpI6rahhjolVuojwCZT0OS2JXyXQVrsAF5t7cYmBp6bFiC07k8FNV-13XzgOx3SewFcmvgEKMsh0R-fyJD0qZ9aujor_ZNy81n34Pz5EVRkFUuY97mjUzCG-E3QG8ye6MW5tXDXiFHzBf8=w1280',
  aparajita:
    'https://sites.google.com/sitesv-images-rt/AMxu72u6-LTutnu_XrDnB7qJ55NZApMzFuGKGFV3b7NmpxEI-GMxhMqSwvFEnCIO0EOE83o8Op9z_s0BtB4CYcMAZRd3u8Lq5U_uzv_q2Ipwok3YcIj1egn6R2-xjyva_DuxSgmWiNsMe_N4yAXPbhQd1rJUCkf6xlr06zhrX_fQ-YIksx4eQE3mPz3mUNH1mBI0OG8z9xMhgY_nD-QUVFhF-g1wFMoTaz9Ggpu9S9ATWvw=w1280',
  golpokotha:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQVZF5WkbOY0fIRMYjKhDVfgPU4fX3Oa1fN_cSESYt65nCfHVeWkNtWyGVcDn3VH03MqpNniGpoHCE9GzwSfg_Olzhnr09X3zgsa9zUFu-QCoHkjEVDV3EQVoaBkpS5-iKLhoCNH8D7PlRBbGwJO7vd2L1YIbWm2U4gGYi6S26md8MQBgrUYQYkMwAaDrMnG8w8Hji_MRuAl6qKk6qBSrqKLZitLt_tZ8MSAZj0TjKA=w1280',
  rmg: 'https://lh3.googleusercontent.com/sitesv/AG8ngQVwiYlPwb4tbOf-7HzBZs9qwq3RrzYBd5YzUNPiypHWVL-gmhZodgz6ZBmE0OoZudtNUL5a3YefHHs8IaxcA8s4MkpnltgvUL7juVjw918keyvXV9g0ZnAO5jESLN1pS4P5SIU7FEUxXhaQQzgVG1RnRp5v7SdWoM5InixmW41sAowllrgEmCIf7Ms7uBClu7DgzONH89A7anzoM_M1gunWDCZDsvZoqc0pHnt69x0=w1280',
  nextBillionUsers:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQU9iS_xJnKBp0r3IEDFEp4_2yDILvoJiwbXyN-Sr3XsN1s4SFjK_S7akHmsmTPjbwqSWkTdckFftGUk-Igw6eKfYbUPt-egZeZZSE-nHJSo2cZyyg6wCQHAlQYFyvP7PFdcdPUuIw7q8B4LJ1oRSaaMJfVIHpZ0jnZmV_jTBq5fqnCU6xqLIbMbf_R7TyoWvUVTr99brxMrG3auZAr52rH2H1VMMp2GhbJH0CiP=w1280',
  alorAkash:
    'https://lh3.googleusercontent.com/sitesv/AG8ngQUYvHYoHAqdbFpIKLk-sSJYJ2hpmdFupBVK_aDAvaeCboOe-qrtGct-MIi17Z1SUITMzIVJSZMXCCFK7LAXrav2TIB227C1zpWcm4S1XjyWMbWvdVAWb_1anNzkcS2f_ijbJJX84jKAFkN01nF9MrNa4dBnw7LH0JVXJX1Wpi1-Q4CiwQNyANxcMGAVMs9XwVc0NR2H-z89mVsK-JyF-niPTtifHMEZ4g2cqRsfL60=w1280',
}

const NOVA = 'nova-ahmed-personal-site'
const DIAL_RESEARCH = 'nsu-hci-current-website/dial-research.md'
const PROPOSAL = 'DIAL Proposal.md — "Projects"'

/**
 * DIAL Projects. Three sources, merged where they clearly describe the same work
 * (each merge is named in `provenance.sourceNote`):
 *
 * - Dr. Nova Ahmed's personal-site project pages (the best-described records);
 * - the DIAL Proposal's "Projects" section (Bengali names, leads, status);
 * - the NSU HCI "DIAL Research" page.
 *
 * `status` is set only where a source states it (Proposal "Ongoing"/"Completed
 * Project", the personal home page's "Ongoing Projects" list, or "This is an
 * active project"). Team links use full names only; first-name-only member
 * lists in the Proposal are not linked. Dates are left null: the year in a
 * DIAL Research heading does not say whether work started or was reported then.
 * Proposal-only stubs without a description (KothaRupa; Automated Test Case
 * Generation; "My Freedom Through Light") are omitted.
 *
 * `publications` holds publications.ts ids, matched from the citation list on
 * each project page by DOI (when the titles also agree) or by normalized title
 * (exact or ≥0.88 similar). Citations with no match are skipped, not guessed.
 * Links not taken from a project page are marked "heuristic publication link".
 */
export const projects: Project[] = [
  {
    id: 'protibadi',
    slug: 'protibadi',
    title: 'Protibadi',
    abstract:
      'Technology design to support women facing sexual harassment — initially a website, later a low-cost wearable device. The work started in Bangladesh and later explored regions in South Asia including India and Pakistan.',
    content: [
      '## About the project',
      'Dr. Nova Ahmed collaborated with Dr. Ishtiaque Ahmed and Dr. Hasan Shahid Ferdous at the beginning of the project; students joined later. The team describes it as a passion project carried out without any external funding.',
      '## Wearable security',
      "The Jalli middleware connects to a very low cost IoT device, 'Protibaadi', using whatever network is available: short-range communication such as Bluetooth, cellular networks, or — when the internet is available — the cloud, where IoT data is stored for long-term analytics. Its strength is acting in real time in low-resource regions.",
    ].join('\n\n'),
    heroImage: IMG.protibadi,
    teamMembers: ['nova-ahmed'],
    themes: ['gender-feminist-hci', 'safety-security'],
    awards: ['chi-2019-best-paper'],
    status: null,
    featured: true,
    publications: [
      '2014-protibadi-platform-fighting-sexual-harassment',
      '2019-they-dont-leave-us-alone',
      '2016-discussing-about-sexual-harassment-breaking',
      '2016-computing-beyond-gender-imposed-limits',
      '2016-protibadi-next-sensor-support-handle',
      '2019-protibadi-starting-fight-against-sexual',
      '2018-strategic-communication-counter-sexual-harassment',
      '2022-technology-empowerment-context-urban-afghan',
      '2016-softsense-sensing-software-level',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-protibadi.md — "Protibadi"; merged with ${DIAL_RESEARCH} — "Development of Wearable Security for Women Against Sexual Harassment". Award link: the CHI 2019 paper is listed on the project page.`,
    },
  },
  {
    id: 'jyoti',
    slug: 'jyoti',
    title: 'Jyoti',
    localName: 'জ্যোতি',
    abstract: 'Context aware technology solution for the visually impaired people of Bangladesh.',
    teamMembers: ['ifti-azad-abeer', 'eusra-amreen', 'mahir-morshed'],
    themes: ['accessibility-inclusion'],
    status: 'ongoing',
    featured: true,
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Jyoti (জ্যোতি)" (Ongoing; lead Ifti Azad Abeer, members Eusra Amreen and Mahir Morshed).`,
    },
  },
  {
    id: 'mon-majhi',
    slug: 'mon-majhi',
    title: 'Mon Majhi',
    abstract:
      'Supporting wellbeing, specifically mental health — a topic that is ignored in low-resource regions.',
    content: [
      '## Team',
      'Md. Sabbir Ahmed leads the project along with Tanvir Fuad.',
      '## Funding',
      'A BDT 499,500 grant from North South University and United International University (2022) for "A Real-Time Approach to Identify Psychological Problems Unobtrusively Through Explainable Machine Learning Model", which is part of Mon Majhi.',
    ].join('\n\n'),
    heroImage: IMG.monMajhi,
    externalUrl: 'https://sites.google.com/view/sabbir-eub/projects/mon-majhi',
    // "Tanvir Fuad" is not linked to the Tanvir Hasan Fuad record without confirmation.
    teamMembers: ['md-sabbir-ahmed', 'nova-ahmed'],
    grants: ['nsu-uiu-xml-psychological-problems'],
    themes: ['mental-health-wellbeing', 'explainable-ai-ml'],
    status: 'ongoing',
    featured: true,
    publications: [
      '2023-fast-minimal-system-identify-depression',
      '2022-less-more-leveraging-digital-behavioral',
      '2022-exploring-unique-app-signature-depressed',
      '2021-identifying-high-low-academic-result',
      '2020-empirical-study-analyze-impact-instagram',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-mental-health-with-mon-majhi.md — "Mental Health with Mon Majhi"; status from ${NOVA}/home.md "Ongoing Projects"; hero is its thumbnail on ${NOVA}/research.md.`,
    },
  },
  {
    id: 'shondhi',
    slug: 'shondhi',
    title: 'Shondhi',
    localName: 'স্যন্ধি',
    abstract:
      'Supporting children with autism. The project first targeted locally designed content for children with autism, then turned to the challenges caregivers face and developed the Shondhi application for them.',
    content: [
      '## Team',
      'Anik Saha, Anik Sinha, and Ifti Azad Abeer worked with Dr. Nova Ahmed on the project, which started as a class project. The Proposal names Anik Sinha as lead of "Shondhi and Shongi: Autism Research in Bangladesh: A Qualitative Design Centric Approach".',
      '## Related work on the DIAL Research page',
      'A personalized communication application for children with autism, designed through participatory design sessions with parents and teachers; an earlier learning application, DurontoShishu, built over 1.5 years in Bangladesh; and a 2026 participatory evaluation and deployment of the parent–teacher communication application.',
    ].join('\n\n'),
    heroImage: IMG.shondhi,
    teamMembers: ['anik-sinha', 'anik-saha', 'ifti-azad-abeer', 'nova-ahmed'],
    // The Proposal gives Shondhi's funding as "NSU CTRG fund 5 Lac BDT"; both
    // CTRG autism grants in the funding table match that description.
    grants: ['ctrg-autism-tech-development', 'ctrg-22-seps-01-autism-parent-teacher'],
    themes: ['accessibility-inclusion'],
    status: 'ongoing',
    featured: true,
    publications: [
      '2019-managing-autism-spectrum-disorder-developing',
      '2020-understanding-educational-landscape-children-autism',
      '2018-reinforcement-based-learning-communicative-android',
      // heuristic publication link — autism papers listed in the Proposal, not on the project page
      '2024-platform-connectivity-synergy-between-parents',
      '2021-understanding-education-children-autism-bangladesh',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-autism.md — "Shondhi"; merged with ${PROPOSAL} → "Shondhi and Shongi (স্যন্ধি অ্যান্ড সঙ্গী)" (Ongoing; localName from its heading) and the three autism entries on ${DIAL_RESEARCH}. Scope of "Shondhi" vs "Shondhi and Shongi" needs confirmation.`,
    },
  },
  {
    id: 'shonabondhu',
    slug: 'shonabondhu',
    title: 'Shonabondhu',
    abstract:
      'A low-cost, feasible distributed sensing system for real-time detection and handling of flash floods — an IoT device to handle flash flood.',
    content: [
      '## About the project',
      'This is an active project. Work began after 2011, when Dr. Nova Ahmed returned to Bangladesh.',
      '## Team',
      'Nabila, Maisha, Rozana, Majedur, Shoaib, Nazmus, and Salman, along with Shuvashis, Rifat, Sian, Syrus, and Mahmudur.',
    ].join('\n\n'),
    heroImage: IMG.shonabondhu,
    teamMembers: ['nova-ahmed'],
    grants: ['nsu-shonabondhu', 'systers-shonabondhu'],
    themes: ['iot-low-cost-hardware'],
    awards: ['ghc-2013-new-investigators-award'],
    status: 'ongoing',
    featured: true,
    publications: [
      '2021-development-testing-low-cost-water',
      '2017-gradient-sensing-middleware-handle-flash',
      '2015-poster-shonabondhu-sensing-middleware-handle',
      '2014-implementation-flash-flood-monitoring-system',
      '2013-gradient-sensor-middleware-system-design',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-project-shonabondhu.md — "Shonabondhu" ("This is an active project"). Team names are first names only and are not linked.`,
    },
  },
  {
    id: 'next-billion-users',
    slug: 'next-billion-users',
    title: 'Next Billion Users',
    abstract:
      "Research with Google on women's access to technology in South Asia. South Asian women have less access to personal devices; they often share phones with family members whose monitoring reduces their online privacy. The study covered 195 people across India, Bangladesh (N=55), and Pakistan to understand social norms and improve privacy controls.",
    heroImage: IMG.nextBillionUsers,
    startDate: '2017',
    teamMembers: ['nova-ahmed', 'nithya-sambasivan'],
    grants: ['google-next-billion-users'],
    themes: ['gender-feminist-hci', 'safety-security'],
    awards: ['chi-2019-best-paper', 'soups-2018-iapp-distinguished-privacy-award'],
    status: null,
    featured: true,
    publications: [
      '2019-gender-equitable-privacy-security-south',
      '2019-they-dont-leave-us-alone',
      '2018-privacy-not-me-those-rich',
      '2017-gender-equity-technologies-considerations-design',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-next-biliion-users.md — "Next Biliion Users" (title spelling from ${NOVA}/research.md); merged with ${DIAL_RESEARCH} — "Google Gender and Technology Research in Bangladesh 2017" (abstract). Awards are the two award-winning papers the project page lists.`,
    },
  },
  {
    id: 'bap-re-bap',
    slug: 'bap-re-bap',
    title: 'Bap re Bap',
    abstract:
      'A study of driver stress where the traffic situation is difficult in Bangladesh, using a low-cost wearable that is locally developed.',
    content: [
      '## Approach',
      'Self-reported stress of drivers was studied alongside their personality category through quantitative (n=88) and qualitative (n=26) user studies. Once the stress level was confirmed, the team designed a low-cost, real-time stress measurement system using heart rate variability (HRV) and road conditions, built on a connectivity framework.',
      '## Funding',
      'Initial seed funding from North South University; Mr. Mirza Md. Lutfe Elahi is the PI of the funding.',
    ].join('\n\n'),
    heroImage: IMG.bapReBap,
    // Rahat Jahangir Rony co-authored the HRV papers the project page lists.
    teamMembers: ['nova-ahmed', 'rahat-jahangir-rony'],
    grants: ['nsu-bap-re-bap-seed'],
    themes: ['iot-low-cost-hardware', 'mental-health-wellbeing'], // heuristic theme assignment
    awards: ['comsnets-2019-best-poster'],
    status: null,
    publications: [
      '2021-understanding-self-reported-stress-among',
      '2024-understanding-driving-stress-urban-bangladesh',
      '2019-understanding-drivers-wellbeing-quantitative-study',
      '2019-monitoring-driving-stress-hrv',
      '2015-bap-re-bap-driving-experiences',
      '2014-computer-vision-based-road-traffic',
      '2015-map-matching-sparse-gps-data',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-bap-re-bap.md — "Bap re Bap"; merged with ${DIAL_RESEARCH} — "Assessment of the Driving Behavior and Stress in Multi-modal Road Culture in Developing Countries". Award link: "Monitoring Driving Stress using HRV" is listed on the project page.`,
    },
  },
  {
    id: 'tuntuni',
    slug: 'tuntuni',
    title: 'TunTuni',
    abstract:
      'Technology-related challenges for the young population of Bangladesh — including how access to technology adds to or reduces communication complexity between parents and teens.',
    content: [
      '## Team',
      'Rahat Jahangir Rony led this project.',
      '## Related work on the DIAL Research page',
      "Teens' online behavior in Bangladesh — online risk behaviors and support mechanisms for a safe digital space — and the teen–parent relationship, where parental mediation of technology use shapes the relationship negatively or positively.",
    ].join('\n\n'),
    heroImage: IMG.tuntuni,
    teamMembers: ['rahat-jahangir-rony', 'nova-ahmed'],
    themes: ['safety-security', 'mental-health-wellbeing'], // heuristic theme assignment
    status: 'ongoing',
    publications: [
      '2022-my-mom-took-my-phone',
      '2020-mom-thinks-technology-my-enemy',
      '2020-understanding-teens-online-awareness-knowledge',
      '2025-teens-online-behavior-support-interventions',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-teen-and-youth.md — "About Teen and Young Population" (titled "TunTuni" and listed under "Ongoing Projects" on ${NOVA}/home.md); merged with ${DIAL_RESEARCH} — "Teens' Online Behavior in Bangladesh" and "Teen-Parent Relationship in the Context of Bangladesh".`,
    },
  },
  {
    id: 'aparajita',
    slug: 'aparajita',
    title: 'Aparajita',
    abstract:
      'A series of projects finding barriers and opportunities for women in STEM, particularly computing, and creating an enabling, supporting environment. It led to the Ada Lovelace Celebration (ALC) for Women in Computing, and continued beyond Bangladesh to Afghanistan.',
    heroImage: IMG.aparajita,
    teamMembers: ['nova-ahmed'],
    themes: ['computing-education-community', 'gender-feminist-hci'],
    status: 'ongoing',
    publications: [
      '2022-impact-socio-economic-factors-female',
      '2022-challenges-women-computing-bangladesh-considering',
      '2022-technology-empowerment-context-urban-afghan',
      '2022-structured-training-enabler-women-ict',
      '2020-challenges-opportunities-young-female-learners',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-women-in-lab.md — "Women in STEM, Computing" (named "Aparajita" under "Ongoing Projects" on ${NOVA}/home.md; "Aporajita" on research.md).`,
    },
  },
  {
    id: 'meena-needs-a-computer-now',
    slug: 'meena-needs-a-computer-now',
    title: 'Meena Needs a Computer Now',
    abstract:
      'Co-design solutions to barriers for women in computing using Fictional Inquiry. The study involved 48 women in computing students from 4 universities across Bangladesh; their challenges and desired solutions were analysed with qualitative methods and NLP-based tools.',
    themes: ['computing-education-community', 'gender-feminist-hci'],
    status: null,
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Meena Needs a Computer Now: Co-design Solutions to Barriers using Fictional Inquiry for Women in Computing". Kept separate from Aparajita until DIAL confirms they are one project.`,
    },
  },
  {
    id: 'golpokotha',
    slug: 'golpokotha',
    title: 'Golpokotha',
    abstract:
      'Solving problems by storytelling. After the August 2018 student protest in Bangladesh and the "digital silence" of internet and social media restrictions that followed, the team collected in-the-moment stories showing how information suppression affected protesters, bystanders, and family members.',
    heroImage: IMG.golpokotha,
    teamMembers: ['nova-ahmed'],
    themes: ['infodemic-misinformation', 'ictd'], // heuristic theme assignment
    status: null,
    publications: [
      '2019-digital-silence-liberating-stories-during',
      '2019-development-digital-family-stories-bangladesh',
      '2018-applying-text-mining-protest-stories',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-golpokotha.md — "Golpokotha" (tagline from ${NOVA}/research.md); merged with ${DIAL_RESEARCH} — "Social Justice and Digital Silence in the Context of Bangladesh".`,
    },
  },
  {
    id: 'tech-for-rmg-workers',
    slug: 'tech-for-rmg-workers',
    title: 'Tech for RMG Workers',
    abstract:
      "Understanding the lives of Bangladesh's garment (RMG) workers — around 4 million people in more than five thousand factories — through qualitative interviews with 55 workers from 40 garments, to identify daily challenges and a possible tool to make their lives easier.",
    heroImage: IMG.rmg,
    teamMembers: ['nova-ahmed'],
    grants: ['bracu-garment-industry'],
    themes: ['ictd'],
    status: null,
    publications: [
      '2020-design-thinking-around-covid-19',
      '2020-social-distancing-challenges-marginal-communities',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${NOVA}/research-tech-for-rmg-workers.md — "Tech for RMG workers" ("with BRACU" on ${NOVA}/research.md); abstract from ${DIAL_RESEARCH} — "Digital RMG Mapping in Bangladesh 2020", treated as the same work.`,
    },
  },
  {
    id: 'notun-digonto',
    slug: 'notun-digonto',
    title: 'Notun Digonto',
    localName: 'নতুন দিগন্ত',
    abstract:
      "Evaluating 4IR technology adoption in the RMG industries of Bangladesh: a mixed-method study of 75 participants across four factories identifies human, technological, and organizational frictions, and proposes a transitional framework that aligns automation stages with workers' skills and existing practice.",
    teamMembers: ['antara-saha'],
    themes: ['ictd'],
    status: 'ongoing',
    publications: ['2025-we-just-one-step-away'],
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Notun Digonto (নতুন দিগন্ত)" (Ongoing; lead Antara Saha); abstract detail from ${DIAL_RESEARCH} — "We Are Just One Step Away… 2025", treated as its output. Member "Ifti" is not linked (ambiguous first name).`,
    },
  },
  {
    id: 'alor-akash',
    slug: 'alor-akash',
    title: 'Alor Akash',
    abstract:
      "Intersections of gender and technology in Bangladesh: understanding technology use and financial inclusion through the barriers and opportunities for advancing women's financial inclusion, including the experiences of low-income women across regions and occupations.",
    heroImage: IMG.alorAkash,
    externalUrl: 'https://sites.google.com/view/alorakash/home',
    teamMembers: ['nova-ahmed'],
    // The Gates grant's topic ("technology and fintech barriers for women and
    // marginal ones") matches Alor Akash ("Including women in fintech").
    grants: ['gates-fintech-barriers'],
    themes: ['gender-feminist-hci', 'ictd'],
    status: 'completed',
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Alor Akash: Intersections of Gender and Technology in Bangladesh"; "Completed Project" in DIAL Proposal.md; hero is its thumbnail on ${NOVA}/research.md.`,
    },
  },
  {
    id: 'shohojoyi',
    slug: 'shohojoyi',
    title: 'Shohojoyi',
    localName: 'সহজয়ী',
    abstract:
      'Effectiveness of familiarization with the co-learning method in technology learning of women.',
    teamMembers: ['anik-saha'],
    grants: ['gates-fintech-barriers'],
    themes: ['gender-feminist-hci', 'computing-education-community'],
    status: 'ongoing',
    // heuristic publication link — the lead's co-learning/familiarization paper, from the Proposal publication list
    publications: ['2024-addressing-technology-learning-divide-co'],
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Shohojoyi (সহজয়ী)" (Ongoing; lead Anik Saha; funding "Bill and Melinda Gates Foundation"). Anik Saha's People-page card confirms "Team Lead- Familiarization and Co- Learning Project".`,
    },
  },
  {
    id: 'poisha',
    slug: 'poisha',
    title: 'Poisha',
    localName: 'পয়সা',
    abstract:
      'A qualitative approach to identify factors for alternative credit scoring for the credit invisibles of Bangladesh.',
    teamMembers: ['ifti-azad-abeer'],
    grants: ['ctrg-23-seps-02-credit-scoring'],
    themes: ['ictd'],
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Poisha (পয়সা)" (Ongoing; lead Ifti Azad Abeer; "NSU CTRG fund, BDT 5 Lac"). Ifti's People-page card confirms "Team Lead- Credit Scoring Project".`,
    },
  },
  {
    id: 'mon-bina',
    slug: 'mon-bina',
    title: 'Mon Bina',
    localName: 'মন বিনা',
    abstract:
      'Understanding the mental health challenges and opportunities of people with disabilities in Bangladesh using a mixed-method study.',
    grants: ['uiu-nsu-pwd-mental-health'],
    themes: ['mental-health-wellbeing', 'accessibility-inclusion'],
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `DIAL Proposal.md — "Ongoing" → "Mon Bina (মন বিনা)" ("NSU UIU fund, BDT 5 Lac"). Members are listed by first name only and are not linked.`,
    },
  },
  {
    id: 'beyond-posts',
    slug: 'beyond-posts',
    title: 'Beyond Posts',
    abstract:
      'A study to predict depression among Indo-Bangladeshi individuals using Facebook data.',
    // "Manoshi Das" in the Proposal; the linked protocol paper is by "Turjo, M. D."
    teamMembers: ['manoshi-das-turjo'],
    themes: ['mental-health-wellbeing'],
    status: 'ongoing',
    // heuristic publication link — the lead's Facebook-depression protocol, from the Proposal publication list
    publications: ['2024-predicting-transition-depression-suicidal-ideation'],
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Beyond Posts" (lead Manoshi Das; "NSU_UIU Collaboration fund, BDT 5 Lac" — not matched to a Grant row).`,
    },
  },
  {
    id: 'infodemic-detection',
    slug: 'infodemic-detection',
    title: 'Infodemic Detection',
    abstract: 'Assessing infodemic in post-COVID-19 risk communication and governance.',
    content: '## Team\n\nLed by Dr. Shabana Khan, Dr. Jyoti Misra, and Dr. Nova Ahmed.',
    teamMembers: ['nova-ahmed'],
    grants: ['gdn-infodemic-detection'],
    themes: ['infodemic-misinformation'],
    status: 'ongoing',
    publications: [
      // heuristic publication link — risk-communication paper co-authored with Shabana Khan
      '2024-roles-technology-risk-communication-community',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Infodemic Detection" (Ongoing; "GDN funding, USD 20,000"). Members "Ifti, Saeem, Khushboo, Prachi" are first names only and are not linked.`,
    },
  },
  {
    id: 'fair-ai',
    slug: 'fair-ai',
    title: 'Fair AI',
    localName: 'ফেয়ার এ.আই',
    abstract:
      'Designing accountable and ethical AI for the next billions, considering the needs of South Asian marginalized communities.',
    teamMembers: ['tahsin-mayeesha'],
    grants: ['cps-sipg-02-ai-ethics'],
    themes: ['explainable-ai-ml'],
    status: 'ongoing',
    publications: [
      // heuristic publication link — AI-ethics papers by the two project leads
      '2024-ai4bangladesh-ai-ethics-bangladesh-challenges',
      '2024-know-your-users-explainable-ai',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Fair AI (ফেয়ার এ.আই)" (leads Tahsin Mayeesha and Farzana Islam; "SIPG NSU 3,00,000", matched to the CPS-SIPG-02 "Understanding AI and Ethics" grant of the same amount).`,
    },
  },
  {
    id: 'arc-net',
    slug: 'arc-net',
    title: 'ARC-Net: DeepFake Face Detection Using XAI',
    abstract:
      'An attention-residual mechanism with an EfficientNetB0 backbone for deepfake face detection using explainable AI: ARC-Net (Attention Residual Convolutional Network with EfficientNetB0 Base) for deepfake facial image detection.',
    teamMembers: ['md-shihab-reza', 'monirul-islam-mahmud'],
    themes: ['explainable-ai-ml'],
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Attention-Residual Mechanism with EfficientNetB0 Backbone for DeepFake Face Detection Using XAI" (members and co-leaders Md Shihab Reza, Farhana Elias, Monirul Islam Mahmud; Farhana Elias has no Team record).`,
    },
  },
  {
    id: 'dfu-dialnet',
    slug: 'dfu-dialnet',
    title: 'DFU_DIALNet',
    abstract:
      'A hybrid approach to detect diabetic foot ulcer: the DFU_DIALNet model combines EfficientNetB0 feature extraction with an SVC, suited to margin-based classification.',
    teamMembers: ['monirul-islam-mahmud', 'md-shihab-reza'],
    themes: ['explainable-ai-ml'], // heuristic theme assignment
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "DFU_DIALNet – A Hybrid Approach to Detect Diabetic Foot Ulcer" (members and co-leaders Monirul Islam Mahmud, Md Shihab Reza, Farhana Elias).`,
    },
  },
  {
    id: 'shathi',
    slug: 'shathi',
    title: 'Shathi',
    localName: 'সাথী',
    abstract: 'A wearable to support women working as maids in Saudi Arabia.',
    content: '## Team\n\nLed by Tata Zafar and Dr. Nova Ahmed.',
    teamMembers: ['nova-ahmed'],
    themes: ['gender-feminist-hci', 'safety-security', 'iot-low-cost-hardware'], // heuristic theme assignment
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Shathi (সাথী)" (Ongoing). Members "Asif, Shubhashish, Ifti, Abir" are first names only and are not linked.`,
    },
  },
  {
    id: 'shohochor',
    slug: 'shohochor',
    title: 'Shohochor',
    localName: 'সহচর',
    abstract: 'NLP in qualitative data analysis: combining human insight and machine efficiency.',
    themes: ['explainable-ai-ml'], // heuristic theme assignment
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "Shohochor (সহচর)". Lead "Mayeesha" is ambiguous (Tahsin Mayeesha / Mayisha Muntaha Alam) and not linked.`,
    },
  },
  {
    id: 'july-movement',
    slug: 'july-movement',
    title: 'July Movement',
    localName: 'জুলাই প্রতিরূপ',
    abstract:
      'A reflective study creating a digital footprint of the July Movement 2024 — a student-led movement to reform the quota system in government jobs that became a mass uprising. The team uses multimodal methods to explore the emotional eruption among protesters.',
    teamMembers: ['anik-sinha', 'ifti-azad-abeer', 'anik-saha'],
    themes: ['infodemic-misinformation'], // heuristic theme assignment
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `${PROPOSAL} → "July Movement (জুলাই প্রতিরূপ)"; merged with ${DIAL_RESEARCH} — "Multimodal Data-Driven Exploration of Emotional Eruption of the July Movement 2024". Only the members named in full are linked.`,
    },
  },
  {
    id: 'social-chatbot-mental-health',
    slug: 'social-chatbot-mental-health',
    title: 'Social Chatbot for Addressing the Mental Health of University Students',
    abstract:
      "University students' perceptions of mental health chatbots and their support needs inform the design of a social chatbot: an empathetic, non-judgmental conversational companion that can identify indicators of depression and suicidal ideation through text.",
    content: '## Team\n\nLed by Dr. Nova Ahmed and Dr. Raihana Sharmin.',
    teamMembers: ['nova-ahmed'],
    themes: ['mental-health-wellbeing'],
    status: 'ongoing',
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Social Chatbot for Addressing the Mental Health of University Students in Bangladesh 2024" (also NSU-CTRG Fund 5); merged with ${PROPOSAL} → "Emotional Support Chatbot" (Ongoing).`,
    },
  },
  {
    id: 'tertiary-student-mental-health',
    slug: 'tertiary-student-mental-health',
    title: 'Mental Health Status & Tech Intervention Design for Tertiary-level Students',
    abstract:
      'Understanding the mental health of young adults through various methods and designing technology interventions that detect mental health issues in a minimalistic manner, with a particular emphasis on young females.',
    themes: ['mental-health-wellbeing'],
    status: null,
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Understanding Mental Health Status & Tech Intervention Design for Tertiary-level Students 2025".`,
    },
  },
  {
    id: 'physician-wellbeing',
    slug: 'physician-wellbeing',
    title: 'Physician Well-being in Bangladesh',
    abstract:
      'During the COVID-19 pandemic, physicians in Bangladesh faced immense mental and physical burdens. This research aimed to understand these challenges and propose a sustainable, adaptable intervention model.',
    teamMembers: ['rahat-jahangir-rony'],
    themes: ['mental-health-wellbeing'],
    // The Proposal lists this under both "Ongoing" and "Completed Project".
    status: null,
    // heuristic publication link — the lead's paper on physicians' burdens, from the Proposal publication list
    publications: ['2025-understanding-mental-physical-burdens-physicians'],
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Physician Well-being in Bangladesh: Burdens and Support Interventions During COVID-19"; merged with ${PROPOSAL} → "Mental Health and Well-being: Impact of COVID-19 on the mental health of the Doctors" (lead Rahat Jahangir Rony).`,
    },
  },
  {
    id: 'shonchalon',
    slug: 'shonchalon',
    title: 'Shonchalon',
    abstract:
      'A low-cost, lightweight wearable (an IMU sensor with an ESP32 BLE board) that supports five essential physiotherapy exercises for post-stroke upper-limb rehabilitation at home, with real-time feedback on exercise accuracy. Clinic-based therapy costs 27,852 BDT/month against an average household income of 15,988 BDT.',
    grants: ['gcrf-stroke-wearables'],
    themes: ['accessibility-inclusion', 'iot-low-cost-hardware'],
    status: null,
    publications: [
      '2024-understanding-sociocultural-challenges-opportunities-affordable',
      '2022-low-cost-wearable-system-support',
    ],
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Shonchalon: An Approach for Observing Rehabilitation of Post-Stroke Patients' Upper Limb Complications Using Low-Cost Sensors 2025"; merged with the 2024 entry "Understanding the sociocultural challenges … poststroke upper-limb rehabilitation". Grant link: the GCRF grant is "Exploring stroke patient wearables".`,
    },
  },
  {
    id: 'nobody-can-see-us',
    slug: 'nobody-can-see-us',
    title: 'Nobody Can See Us',
    abstract:
      'The experiences and well-being of young adults in Bangladesh on online dating platforms, from interviews with 33 participants aged 18 to 25: challenging social norms, gender-specific experiences of abuse and harassment, and alternative uses of dating apps during COVID-19.',
    teamMembers: ['nova-ahmed', 'abdul-wohab', 'monisha-dey'],
    grants: ['cps-sipg-dating-sites'],
    themes: ['gender-feminist-hci', 'safety-security'],
    status: null,
    publications: ['2024-nobody-can-see-us-overview'],
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Nobody Can See Us: An Overview of Online Dating Site Experiences 2023"; team from the COMPASS '24 paper's authors (Nova Ahmed, Abdul Wohab, Monisha Dey) in DIAL Proposal.md.`,
    },
  },
  {
    id: 'cyber-security-data-breach',
    slug: 'cyber-security-data-breach',
    title: 'Cyber Security Concerns and Data Breach',
    abstract:
      'Users are often unaware of the access they give third-party applications, which can expose personal information and lead to negative experiences and security incidents. Closed-group qualitative studies explore how these experiences change decision-making, which varies between people and genders.',
    themes: ['safety-security'],
    status: null,
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Cyber Security Concerns and Data Breach".`,
    },
  },
  {
    id: 'ride-sharing-experiences',
    slug: 'ride-sharing-experiences',
    title: 'Ride-sharing Experiences in Bangladesh',
    abstract:
      "App-based motorbike ride-sharing, introduced in Bangladesh in 2016, is a source of income for unemployed and low-income people. The study explores drivers' economic growth, experience, and empowerment, along with concerns about health and user data privacy.",
    themes: ['ictd'],
    status: null,
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Ride-sharing Experiences in Bangladesh".`,
    },
  },
  {
    id: 'rohingya-health',
    slug: 'rohingya-health',
    title: 'Refugee (Rohingya) Health Problems in Bangladesh',
    abstract:
      'A close study with the Rohingya refugee community and their doctors surfaced physical and mental health challenges. The team is working on a technology solution that supports a limited number of health workers towards the wellbeing of the community.',
    themes: ['ictd', 'mental-health-wellbeing'],
    status: null,
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Refugee (Rohingya) Health Problems in Bangladesh".`,
    },
  },
  {
    id: 'mini-nurse-bot',
    slug: 'mini-nurse-bot',
    title: 'Mini Nurse Healthcare Bot for Old Home',
    abstract:
      'A low-cost mini healthcare bot that assists elderly people to take medicines on schedule — an affordable alternative to multi-purpose robots developing countries cannot afford.',
    themes: ['iot-low-cost-hardware', 'accessibility-inclusion'], // heuristic theme assignment
    status: null,
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Mini Nurse Healthcare Bot for Old Home".`,
    },
  },
  {
    id: 'bornomala-ar',
    slug: 'bornomala-ar',
    title: 'Bornomala AR',
    abstract:
      'An augmented reality Android app for children aged 3 to 5 to learn the Bengali alphabet. In a qualitative study in Dhaka, weekly learning efficiency rose from 41.67% without the app to 58.33% with it.',
    themes: ['computing-education-community'], // heuristic theme assignment
    status: null,
    provenance: {
      source: 'scrape',
      sourceNote: `${DIAL_RESEARCH} — "Bengali Bornomala (Alphabet) in Augmented Reality for Children".`,
    },
  },
]
