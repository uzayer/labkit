import type { Project } from './types'

/**
 * Fixture projects: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const projects: Project[] = [
  {
    id: "protibadi",
    slug: "protibadi",
    title: "Protibadi",
    abstract: "Technology design to support women facing sexual harassment — initially a website, later a low-cost wearable device. The work started in Bangladesh and later explored regions in South Asia including India and Pakistan.",
    content: "## About the project\n\nDr. Nova Ahmed collaborated with Dr. Ishtiaque Ahmed and Dr. Hasan Shahid Ferdous at the beginning of the project; students joined later. The team describes it as a passion project carried out without any external funding.\n\n## Wearable security\n\nThe Jalli middleware connects to a very low cost IoT device, 'Protibaadi', using whatever network is available: short-range communication such as Bluetooth, cellular networks, or — when the internet is available — the cloud, where IoT data is stored for long-term analytics. Its strength is acting in real time in low-resource regions.",
    heroImage: "https://lh3.googleusercontent.com/sitesv/AG8ngQVlXLLBpWY2RjjuuyqcOc_7q4wJr7HlCg_7AgAfNjEGEAeE6F4dVkSVIjrI97pGoMrKzeDsbjlqvmmO3yGwzR29rcITv2EcSvh71JZhFnRhdfT6D3rEYuxkDmVBmhGrfPeXx-vDzeGs75hwEjTIC3eiANWR7qioz5FW5-WTJwf-9IXgpbKNGTdVGnbrMmRmOEV_82Dd_HxrMvoiUmkZF4AhEk-g_Eg3iM2fr2pX=w1280",
    teamMembers: [
      "nova-ahmed"
    ],
    themes: [
      "gender-feminist-hci",
      "safety-security"
    ],
    awards: [
      "chi-2019-best-paper"
    ],
    status: null,
    featured: true,
    publications: [
      "2014-protibadi-platform-fighting-sexual-harassment",
      "2019-they-dont-leave-us-alone"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/research-protibadi.md — \"Protibadi\"; merged with nsu-hci-current-website/dial-research.md — \"Development of Wearable Security for Women Against Sexual Harassment\". Award link: the CHI 2019 paper is listed on the project page."
    }
  },
  {
    id: "shondhi",
    slug: "shondhi",
    title: "Shondhi",
    localName: "স্যন্ধি",
    abstract: "Supporting children with autism. The project first targeted locally designed content for children with autism, then turned to the challenges caregivers face and developed the Shondhi application for them.",
    content: "## Team\n\nAnik Saha, Anik Sinha, and Ifti Azad Abeer worked with Dr. Nova Ahmed on the project, which started as a class project. The Proposal names Anik Sinha as lead of \"Shondhi and Shongi: Autism Research in Bangladesh: A Qualitative Design Centric Approach\".\n\n## Related work on the DIAL Research page\n\nA personalized communication application for children with autism, designed through participatory design sessions with parents and teachers; an earlier learning application, DurontoShishu, built over 1.5 years in Bangladesh; and a 2026 participatory evaluation and deployment of the parent–teacher communication application.",
    heroImage: "https://lh3.googleusercontent.com/sitesv/AG8ngQW_h1f4kgxVuyfyq68lZx0N3jiPWBdPz8s8Uk6e5aekdbP61MXEYhZwevcFjpoGmwzupVn4Py7V0Xs8ENrYyye-SlwrP3MlQS9ZESWJwQ2d9B4PkDMbE4KAHl35r9C5PS75o9UbgWPEfRR_CY67dJ0gzmeiWFdAgd2ZZX0lz7fBWKUQwWTsS6HbmsrOBo3OZuC1YMz2oKdMwkMjqZM51LubVevNLiySX2UaD0zsC8I=w1280",
    teamMembers: [
      "anik-sinha",
      "anik-saha",
      "ifti-azad-abeer",
      "nova-ahmed"
    ],
    grants: [
      "ctrg-autism-tech-development",
      "ctrg-22-seps-01-autism-parent-teacher"
    ],
    themes: [
      "accessibility-inclusion"
    ],
    status: "ongoing",
    featured: true,
    publications: [
      "2019-managing-autism-spectrum-disorder-developing",
      "2020-understanding-educational-landscape-children-autism"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/research-autism.md — \"Shondhi\"; merged with DIAL Proposal.md — \"Projects\" → \"Shondhi and Shongi (স্যন্ধি অ্যান্ড সঙ্গী)\" (Ongoing; localName from its heading) and the three autism entries on nsu-hci-current-website/dial-research.md. Scope of \"Shondhi\" vs \"Shondhi and Shongi\" needs confirmation."
    }
  },
  {
    id: "mon-majhi",
    slug: "mon-majhi",
    title: "Mon Majhi",
    abstract: "Supporting wellbeing, specifically mental health — a topic that is ignored in low-resource regions.",
    content: "## Team\n\nMd. Sabbir Ahmed leads the project along with Tanvir Fuad.\n\n## Funding\n\nA BDT 499,500 grant from North South University and United International University (2022) for \"A Real-Time Approach to Identify Psychological Problems Unobtrusively Through Explainable Machine Learning Model\", which is part of Mon Majhi.",
    heroImage: "https://lh3.googleusercontent.com/sitesv/AG8ngQXRxpt7bPMa1TlMlQASze6XwXskDJguwpZnEkFaqSiJpVhLh-RjA_F7qA1QoR1OQggT-sLPActAf_2U8bDy8npGyUlnF_QBzW5Eudl0cwQNJbvHgMDm_0A11K6sWKGq4-DRqhEjRLnjYfV0jVmkHD97zOMkpF3-4UWhfy0RqNQSmlIhvR9XrbNxsBGuVG8w1bfvGXmO4SOcKm59Y3HP4hu2xdyv3_-eBFzXlC9OXE4=w1280",
    externalUrl: "https://sites.google.com/view/sabbir-eub/projects/mon-majhi",
    teamMembers: [
      "md-sabbir-ahmed",
      "nova-ahmed"
    ],
    grants: [
      "nsu-uiu-xml-psychological-problems"
    ],
    themes: [
      "mental-health-wellbeing",
      "explainable-ai-ml"
    ],
    status: "ongoing",
    featured: true,
    publications: [
      "2023-fast-minimal-system-identify-depression",
      "2022-less-more-leveraging-digital-behavioral"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/research-mental-health-with-mon-majhi.md — \"Mental Health with Mon Majhi\"; status from nova-ahmed-personal-site/home.md \"Ongoing Projects\"; hero is its thumbnail on nova-ahmed-personal-site/research.md."
    }
  },
  {
    id: "bap-re-bap",
    slug: "bap-re-bap",
    title: "Bap re Bap",
    abstract: "A study of driver stress where the traffic situation is difficult in Bangladesh, using a low-cost wearable that is locally developed.",
    content: "## Approach\n\nSelf-reported stress of drivers was studied alongside their personality category through quantitative (n=88) and qualitative (n=26) user studies. Once the stress level was confirmed, the team designed a low-cost, real-time stress measurement system using heart rate variability (HRV) and road conditions, built on a connectivity framework.\n\n## Funding\n\nInitial seed funding from North South University; Mr. Mirza Md. Lutfe Elahi is the PI of the funding.",
    heroImage: "https://lh3.googleusercontent.com/sitesv/AG8ngQXIbNVdAAIkBUleacWQRhFmlb04HmrquO1Oxx0ZgpmcDJOISLMxR-TnkvZZodqn7c7v1zc_5iKoNG8FQwol99HwqI7CzhOAru32cCNB4hLUJyeXUbu6T2pFH0MK_I7rEgotxohZbK2ynyoqnxhhtkjEohfo0hy1IGp6Xq2LEdu57zTxgIUGh6nMizO_5r5D9T356RQKdrZ0P2-iUWL4A8fMNVp2LFhoysmgalJR3GI=w1280",
    teamMembers: [
      "nova-ahmed",
      "rahat-jahangir-rony"
    ],
    grants: [
      "nsu-bap-re-bap-seed"
    ],
    themes: [
      "iot-low-cost-hardware",
      "mental-health-wellbeing"
    ],
    awards: [
      "comsnets-2019-best-poster"
    ],
    status: null,
    publications: [
      "2021-understanding-self-reported-stress-among",
      "2024-understanding-driving-stress-urban-bangladesh",
      "2019-monitoring-driving-stress-hrv"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/research-bap-re-bap.md — \"Bap re Bap\"; merged with nsu-hci-current-website/dial-research.md — \"Assessment of the Driving Behavior and Stress in Multi-modal Road Culture in Developing Countries\". Award link: \"Monitoring Driving Stress using HRV\" is listed on the project page."
    }
  },
  {
    id: "golpokotha",
    slug: "golpokotha",
    title: "Golpokotha",
    abstract: "Solving problems by storytelling. After the August 2018 student protest in Bangladesh and the \"digital silence\" of internet and social media restrictions that followed, the team collected in-the-moment stories showing how information suppression affected protesters, bystanders, and family members.",
    heroImage: "https://lh3.googleusercontent.com/sitesv/AG8ngQVZF5WkbOY0fIRMYjKhDVfgPU4fX3Oa1fN_cSESYt65nCfHVeWkNtWyGVcDn3VH03MqpNniGpoHCE9GzwSfg_Olzhnr09X3zgsa9zUFu-QCoHkjEVDV3EQVoaBkpS5-iKLhoCNH8D7PlRBbGwJO7vd2L1YIbWm2U4gGYi6S26md8MQBgrUYQYkMwAaDrMnG8w8Hji_MRuAl6qKk6qBSrqKLZitLt_tZ8MSAZj0TjKA=w1280",
    teamMembers: [
      "nova-ahmed"
    ],
    themes: [
      "infodemic-misinformation",
      "ictd"
    ],
    status: null,
    publications: [
      "2019-digital-silence-liberating-stories-during",
      "2019-development-digital-family-stories-bangladesh"
    ],
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/research-golpokotha.md — \"Golpokotha\" (tagline from nova-ahmed-personal-site/research.md); merged with nsu-hci-current-website/dial-research.md — \"Social Justice and Digital Silence in the Context of Bangladesh\"."
    }
  },
  {
    id: "alor-akash",
    slug: "alor-akash",
    title: "Alor Akash",
    abstract: "Intersections of gender and technology in Bangladesh: understanding technology use and financial inclusion through the barriers and opportunities for advancing women's financial inclusion, including the experiences of low-income women across regions and occupations.",
    heroImage: "https://lh3.googleusercontent.com/sitesv/AG8ngQUYvHYoHAqdbFpIKLk-sSJYJ2hpmdFupBVK_aDAvaeCboOe-qrtGct-MIi17Z1SUITMzIVJSZMXCCFK7LAXrav2TIB227C1zpWcm4S1XjyWMbWvdVAWb_1anNzkcS2f_ijbJJX84jKAFkN01nF9MrNa4dBnw7LH0JVXJX1Wpi1-Q4CiwQNyANxcMGAVMs9XwVc0NR2H-z89mVsK-JyF-niPTtifHMEZ4g2cqRsfL60=w1280",
    externalUrl: "https://sites.google.com/view/alorakash/home",
    teamMembers: [
      "nova-ahmed"
    ],
    grants: [
      "gates-fintech-barriers"
    ],
    themes: [
      "gender-feminist-hci",
      "ictd"
    ],
    status: "completed",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/dial-research.md — \"Alor Akash: Intersections of Gender and Technology in Bangladesh\"; \"Completed Project\" in DIAL Proposal.md; hero is its thumbnail on nova-ahmed-personal-site/research.md."
    }
  },
  {
    id: "jyoti",
    slug: "jyoti",
    title: "Jyoti",
    localName: "জ্যোতি",
    abstract: "Context aware technology solution for the visually impaired people of Bangladesh.",
    teamMembers: [
      "ifti-azad-abeer",
      "eusra-amreen",
      "mahir-morshed"
    ],
    themes: [
      "accessibility-inclusion"
    ],
    status: "ongoing",
    featured: true,
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Projects\" → \"Jyoti (জ্যোতি)\" (Ongoing; lead Ifti Azad Abeer, members Eusra Amreen and Mahir Morshed)."
    }
  }
]
