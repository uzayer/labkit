import type { News } from './types'

/**
 * Fixture news: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const news: News[] = [
  {
    id: "iftar-knowledge-dissemination-2026",
    type: "event",
    date: "2026-03-11",
    datePrecision: "day",
    title: "Research Knowledge Dissemination Session Following the Annual Iftar",
    description: "A research knowledge dissemination session held after the annual Iftar.",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/events.md — \"Upcoming Events\" (listed with the date March 11, 2026; no description)"
    }
  },
  {
    id: "flood-relief-2024",
    type: "community",
    date: "2024",
    datePrecision: "year",
    title: "Organizing Flood Relief, 2024",
    description: "DIAL organized flood relief in 2024.",
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"DIAL Events\" (photo not resolved in the capture)"
    }
  },
  {
    id: "sigchi-winter-school-2024-colombo",
    type: "academic",
    date: "2024-01-02",
    datePrecision: "day",
    title: "ACM SIGCHI Winter School 2024 – Colombo, Sri Lanka",
    description: "Held in Colombo from 2–4 January 2024, the winter school explored HCI in the South Asian context through keynotes, workshops, and discussions on user-centered design, accessibility, and inclusive technologies. DIAL members attended, and Dr. Nova Ahmed contributed as a speaker.",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQU-zqxOjTLyRobuNadv79KT4C1_ucKqS8mWwm6iSb2JqxDG-F-KUJlQ30BkbUa80RT2GmEaIVwIBhiZyfsiKk8qAyt8MXQny-XLlnbrAMLOG2j2HiGLDMnNXbuxg9OgXLWBLWaHEkTybN3L5hVyxutJtgkWxX_AZqwwjyFtFTZUXTiZTDV5AgddBDLJ_uHs_i809Gi08jci0oWjvLskQpNoCcVtpUW-yUoswb2RhKk=w1280",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/events.md — \"ACM SIGCHI Winter School 2024 – Colombo, Sri Lanka\""
    }
  },
  {
    id: "dial-hci-research-symposium-2023",
    type: "event",
    date: "2023-06-01",
    datePrecision: "day",
    title: "DIAL HCI Research Symposium: Connecting Young Researchers With Experts 2023",
    description: "Organized by DIAL, the symposium gave emerging and junior researchers a platform to engage with senior scholars and faculty, including Dr. Nova Ahmed. New and established research teams presented ongoing work and received feedback and mentorship.",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQXs-Swyu9JLJy_G6Ec-aB5pGMzkbzgheABB4iBVT4znEBf7PRUOo7VjGXTm6hBom3o-eKNGYyCp_d-6UaBo58yOWy47c_8mfCia-2lDV_ezepDzqGsTdMivdcJukN_BoKUYECoZ3qPpc1LmK0oUi6rYiVoDBeRvEZJeWP50N1HXLNLZZlbxwN_ry3H5SzYz6iUVZ73XHR6Va5MHc0Q0_1u2lURKsy-FiJVtKCCS=w1280",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/events.md — \"DIAL HCI Research Symposium: Connecting Young Researchers With Experts 2023\" (date from the photo caption); \"Dial Conference 2023\" in DIAL Proposal.md"
    }
  },
  {
    id: "technique-protibadi-2023",
    type: "community",
    date: "2023-04-04",
    datePrecision: "day",
    title: "Technique: Nova Ahmed's new app combats sexual misconduct",
    description: "Technique, the Georgia Tech student newspaper, covered Dr. Nova Ahmed’s app against sexual harassment.",
    url: "https://nique.net/news/2023/04/04/nova-ahmeds-new-app-combats-sexual-misconduct/",
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/home-news.md — \"Technique Magazine at GeorgiaTech\" (date from the article URL)"
    }
  },
  {
    id: "sigchi-virtual-summer-school-2020",
    type: "event",
    date: "2020-06",
    datePrecision: "month",
    title: "ACM SIGCHI Virtual Summer School 2020, Bangladesh",
    description: "Postponed from March 2020 by the COVID-19 outbreak, the virtual summer school ran in June 2020 to help young researchers, practitioners, and students from Asia understand research methodologies relevant to CHI and CSCW.",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/events.md — \"ACM SIGCHI Virtual Summer School 2020, Bangladesh\""
    }
  },
  {
    id: "sigchi-winter-school-2019-bangladesh",
    type: "event",
    date: "2019-11",
    datePrecision: "month",
    title: "ACM SIGCHI Winter School 2019, Bangladesh",
    description: "Organized in November 2019 in anticipation of CHI 2021 in Japan, the winter school encouraged researchers and students from Asia, with a focus on the Global South, to submit quality papers to CHI and other HCI conferences.",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQXm8_Ht1OrK-0jkdeag3i4JlTxBltKVVvuOzTMIlBobZmZQIKSDn25-xkQKiq6PDcZMNzNpuuz6KOydH_rDR-JSiuZbfVa16JWXHzAqwGQkVY3eO6_42wJ-s9LRFUYjDnmAV751_0NB84_wyybX1qAD5NFnLpXS6oyHei2tgHKgGHwi4ckm3kNELo3DKapehlTzufU2t97MSrY36TI=w1280",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/events.md — \"ACM SIGCHI Winter School 2019, Bangladesh\""
    }
  },
  {
    id: "grace-hopper-2019",
    type: "academic",
    date: "2019",
    datePrecision: "year",
    title: "Grace Hopper 2019",
    description: "Bangladeshi researchers at the Grace Hopper Celebration in Florida, the world’s largest gathering of women technologists.",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQXBvWvKJOzryJB4UFEVXxvu7qWAMa4xF8aTlrmVTcAzYrQZO6RYVTo8pYixPuHNFhrSDCHgM8CdMdzEZi1HXJMQw5SOK53E70ppA19iCm6y5sdRQQtpby-fCRm3slflv4RrAjIEowvNk2GTTG9E-kvsJnh0uYvCzIaUjO1I5qobrzK6wPDOq-8MtTRY_661aG9ISKJ07ijbztTC=w1280",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/events.md — \"Grace Hopper 2019\""
    }
  },
  {
    id: "hcixb-2018",
    type: "academic",
    date: "2018-04-21",
    datePrecision: "day",
    title: "HCI Across Borders 2018",
    description: "At the HCI Across Borders symposium at CHI 2018 in Montreal, \"Supporting Missing Daughters\" received the Best Poster Award.",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQWgzWQ_iztODVlwMDLT-IftRru8cf8TiEQEKceTdIolyOhgKDYoPSSwD156etvvjXLn68dfvGhbcPqXfKUhXBc1szi355zW3z-LY63SkO7a2AdlpTLMhjDETinUYE7St1StMvy_-jsfiHXb_JjOz240W5F85gTsJF40lLjz1D20y7HfynjVIjHN6T68FdrLRzl4UgnNxwzu54AEqok=w1280",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/events.md — \"HCI Across Borders 2018\"; date and award from nsu-hci-current-website/awards.md — \"CHI HCIxB Symposium 2018 Best Poster\""
    }
  }
]
