import type { Award } from './types'

/**
 * Fixture awards: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const awards: Award[] = [
  {
    id: "compass-2023-best-paper",
    title: "Best Paper Award — Making ethics at home in Global CS Education: Provoking stories from the Souths",
    year: 2023,
    category: "best-paper",
    scope: "lab",
    recipients: [
      {
        teamMember: "nova-ahmed"
      },
      {
        customRecipient: {
          name: "Cat Kutay"
        }
      },
      {
        customRecipient: {
          name: "Shaimaa Lazem"
        }
      },
      {
        customRecipient: {
          name: "Marisol Wong-Villacres"
        }
      },
      {
        customRecipient: {
          name: "Cristina Abad"
        }
      },
      {
        customRecipient: {
          name: "Cesar Collazos"
        }
      },
      {
        customRecipient: {
          name: "Shady Elbassuoni"
        }
      },
      {
        teamMember: "lamia-iftekhar"
      },
      {
        customRecipient: {
          name: "Farzana Islam"
        }
      },
      {
        customRecipient: {
          name: "Deepa Singh"
        }
      },
      {
        teamMember: "tahsin-mayeesha"
      },
      {
        customRecipient: {
          name: "Martin Ujakpamabeifam"
        }
      },
      {
        customRecipient: {
          name: "Tariq Zaman"
        }
      },
      {
        customRecipient: {
          name: "Nicola Bidwell"
        }
      }
    ],
    organizationLabel: "ACM COMPASS 2023 (ACM Journal on Computing and Sustainable Societies)",
    featured: true,
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/awards.md — \"Paper Awards\" → \"ACM Journal on Computing and Sustainable Societies (COMPASS 2023) Best Paper\"; \"Best Journal Paper Award\" in DIAL Proposal.md — \"Awards\". Tahsin Mayeesha is listed as \"Tasmiah Tahsin Mayeesha\"."
    }
  },
  {
    id: "chi-2019-best-paper",
    title: "Best Paper Award (Best of CHI) — \"They Don’t Leave Us Alone Anywhere We Go\": Gender and Digital Abuse in South Asia",
    year: 2019,
    category: "best-paper",
    scope: "lab",
    recipients: [
      {
        teamMember: "nithya-sambasivan"
      },
      {
        customRecipient: {
          name: "A. Batool"
        }
      },
      {
        teamMember: "nova-ahmed"
      },
      {
        customRecipient: {
          name: "T. Matthews"
        }
      },
      {
        customRecipient: {
          name: "K. Thomas"
        }
      },
      {
        customRecipient: {
          name: "L. Gaytán-Lugo"
        }
      },
      {
        customRecipient: {
          name: "D. Nemer"
        }
      },
      {
        customRecipient: {
          name: "E. Bursztein"
        }
      },
      {
        customRecipient: {
          name: "E. Churchill"
        }
      },
      {
        customRecipient: {
          name: "S. Consolvo"
        }
      }
    ],
    organizationLabel: "ACM CHI 2019",
    featured: true,
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/awards.md — \"Paper Awards\" → \"CHI 2019 Best Paper\"; also DIAL Proposal.md — \"Awards\""
    }
  },
  {
    id: "comsnets-2019-best-poster",
    title: "Best Poster Award — Monitoring Driving Stress using HRV",
    year: 2019,
    category: "best-poster",
    scope: "lab",
    recipients: [
      {
        teamMember: "rahat-jahangir-rony"
      },
      {
        teamMember: "nova-ahmed"
      }
    ],
    organizationLabel: "COMSNETS 2019",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/awards.md — \"Paper Awards\" → \"COMSNETS 2019 Best Short Paper\"; DIAL Proposal.md — \"Awards\"; nsu-hci-current-website/events.md — \"COMSNETS 2019\" photo caption"
    }
  },
  {
    id: "soups-2024-ten-year-impact-award",
    title: "10 Years Impact Award",
    year: 2024,
    category: "impact",
    scope: "lab",
    recipients: [],
    organizationLabel: "SOUPS (USENIX)",
    featured: true,
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Awards\" (\"10 years Impact Award: SOUPS Usenix Conference (2024)\")"
    }
  },
  {
    id: "hcixb-2018-best-poster",
    title: "Best Poster Award — Supporting Missing Daughters",
    year: 2018,
    category: "best-poster",
    scope: "lab",
    recipients: [
      {
        teamMember: "nova-ahmed"
      },
      {
        teamMember: "tamanna-motahar"
      },
      {
        customRecipient: {
          name: "Sharmin Kabir"
        }
      },
      {
        teamMember: "munir-hasan"
      }
    ],
    organizationLabel: "HCI Across Borders, CHI 2018",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/awards.md — \"Paper Awards\" → \"CHI HCIxB Symposium 2018 Best Poster\""
    }
  },
  {
    id: "ghc-2019-faculty-scholar",
    title: "Grace Hopper Conference for Women in Computing, Faculty Scholar",
    year: 2019,
    category: "scholarship",
    scope: "personal",
    recipients: [
      {
        teamMember: "nova-ahmed"
      }
    ],
    organizationLabel: "Grace Hopper Conference for Women in Computing",
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/awards.md — \"Awards\"; also DIAL Proposal.md — \"Awards\""
    }
  },
  {
    id: "gestc-2014-best-paper",
    title: "Best Paper Award",
    year: 2014,
    category: "best-paper",
    scope: "personal",
    recipients: [
      {
        teamMember: "nova-ahmed"
      }
    ],
    organizationLabel: "Global Engineering, Science and Technology Conference",
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/awards.md — \"Awards\""
    }
  }
]
