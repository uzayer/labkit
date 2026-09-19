import type { News } from './types'

/**
 * Lab activity for /news. There is no LabKit News collection yet (see
 * dial-test/CLAUDE.md). Entries come from the NSU HCI Events page, the DIAL
 * Proposal's "DIAL Events", and dated items on Dr. Nova Ahmed's News and
 * Talks pages. Undated personal news items are left out. Note that the Events
 * page covers NSUHCI and the Dhaka ACM SIGCHI Chapter (BanglaCHI) as well as
 * DIAL, so some entries are community events DIAL members attended.
 *
 * `date` states only what the source states; `datePrecision` says how much.
 * Descriptions are condensed from the source text. Photos are the captioned
 * image for the event; entries without one are left without a photo.
 */
export const news: News[] = [
  {
    id: 'iftar-knowledge-dissemination-2026',
    type: 'event',
    date: '2026-03-11',
    datePrecision: 'day',
    title: 'Research Knowledge Dissemination Session Following the Annual Iftar',
    description: 'A research knowledge dissemination session held after the annual Iftar.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "Upcoming Events" (listed with the date March 11, 2026; no description)',
    },
  },
  {
    id: 'flood-relief-2024',
    type: 'community',
    date: '2024',
    datePrecision: 'year',
    title: 'Organizing Flood Relief, 2024',
    description: 'DIAL organized flood relief in 2024.',
    provenance: {
      source: 'scrape',
      sourceNote: 'DIAL Proposal.md — "DIAL Events" (photo not resolved in the capture)',
    },
  },
  {
    id: 'july-movement-support-2024',
    type: 'community',
    date: '2024',
    datePrecision: 'year',
    title: 'Supporting Affected People in the July Movement, 2024',
    description: 'DIAL supported people affected during the July Movement in 2024.',
    provenance: {
      source: 'scrape',
      sourceNote: 'DIAL Proposal.md — "DIAL Events" (photo not resolved in the capture)',
    },
  },
  {
    id: 'iftar-2024',
    type: 'community',
    date: '2024',
    datePrecision: 'year',
    title: 'Iftar Party, 2024',
    description: 'The Lab gathered for Iftar in 2024.',
    provenance: {
      source: 'scrape',
      sourceNote: 'DIAL Proposal.md — "DIAL Events" (photo not resolved in the capture)',
    },
  },
  {
    id: 'sigchi-winter-school-2024-colombo',
    type: 'academic',
    date: '2024-01-02',
    datePrecision: 'day',
    title: 'ACM SIGCHI Winter School 2024 – Colombo, Sri Lanka',
    description:
      'Held in Colombo from 2–4 January 2024, the winter school explored HCI in the South Asian context through keynotes, workshops, and discussions on user-centered design, accessibility, and inclusive technologies. DIAL members attended, and Dr. Nova Ahmed contributed as a speaker.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQU-zqxOjTLyRobuNadv79KT4C1_ucKqS8mWwm6iSb2JqxDG-F-KUJlQ30BkbUa80RT2GmEaIVwIBhiZyfsiKk8qAyt8MXQny-XLlnbrAMLOG2j2HiGLDMnNXbuxg9OgXLWBLWaHEkTybN3L5hVyxutJtgkWxX_AZqwwjyFtFTZUXTiZTDV5AgddBDLJ_uHs_i809Gi08jci0oWjvLskQpNoCcVtpUW-yUoswb2RhKk=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "ACM SIGCHI Winter School 2024 – Colombo, Sri Lanka"',
    },
  },
  {
    id: 'dial-hci-research-symposium-2023',
    type: 'event',
    date: '2023-06-01',
    datePrecision: 'day',
    title: 'DIAL HCI Research Symposium: Connecting Young Researchers With Experts 2023',
    description:
      'Organized by DIAL, the symposium gave emerging and junior researchers a platform to engage with senior scholars and faculty, including Dr. Nova Ahmed. New and established research teams presented ongoing work and received feedback and mentorship.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQXs-Swyu9JLJy_G6Ec-aB5pGMzkbzgheABB4iBVT4znEBf7PRUOo7VjGXTm6hBom3o-eKNGYyCp_d-6UaBo58yOWy47c_8mfCia-2lDV_ezepDzqGsTdMivdcJukN_BoKUYECoZ3qPpc1LmK0oUi6rYiVoDBeRvEZJeWP50N1HXLNLZZlbxwN_ry3H5SzYz6iUVZ73XHR6Va5MHc0Q0_1u2lURKsy-FiJVtKCCS=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "DIAL HCI Research Symposium: Connecting Young Researchers With Experts 2023" (date from the photo caption); "Dial Conference 2023" in DIAL Proposal.md',
    },
  },
  {
    id: 'technique-protibadi-2023',
    type: 'community',
    date: '2023-04-04',
    datePrecision: 'day',
    title: "Technique: Nova Ahmed's new app combats sexual misconduct",
    description:
      'Technique, the Georgia Tech student newspaper, covered Dr. Nova Ahmed’s app against sexual harassment.',
    url: 'https://nique.net/news/2023/04/04/nova-ahmeds-new-app-combats-sexual-misconduct/',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nova-ahmed-personal-site/home-news.md — "Technique Magazine at GeorgiaTech" (date from the article URL)',
    },
  },
  {
    id: 'agami-science-fair-2023',
    type: 'community',
    date: '2023',
    datePrecision: 'year',
    title: 'Talk at the 5th LiF Annual Science Fair 2023',
    description:
      'Dr. Nova Ahmed spoke at the 5th LiF Annual Science Fair, organized by Agami Education Foundation.',
    url: 'https://www.youtube.com/watch?v=gMwpOxH_5Ws',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nova-ahmed-personal-site/home-talks.md — "5th LiF Annual Science Fair 2023 organized by Agami Education Foundation"',
    },
  },
  {
    id: 'brac-r2fif-2022',
    type: 'academic',
    date: '2022',
    datePrecision: 'year',
    title: 'How to make digital solutions and services gender-intentional — R2FIF 2022, BRAC',
    description:
      'Dr. Nova Ahmed spoke at BRAC’s R2FIF 2022 on making digital solutions and services gender-intentional.',
    url: 'https://www.youtube.com/watch?v=AsA3KMWYrP8',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nova-ahmed-personal-site/home-talks.md — "How to make digital solutions and services gender-intentional | R2FIF 2022 | BRAC"; home-news.md — "BRAC talk"',
    },
  },
  {
    id: 'eastern-university-orientation-2022',
    type: 'academic',
    date: '2022',
    datePrecision: 'year',
    title: 'Orientation speech at Eastern University, Fall 2022',
    description:
      'Dr. Nova Ahmed gave the orientation speech for Eastern University’s Fall 2022 programme.',
    url: 'https://www.youtube.com/watch?v=jajyyeVxWYc',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nova-ahmed-personal-site/home-talks.md — "Speech of Prof. Dr. Nova Ahmed, ECE Dept., NSU | Orientation Program- Fall 2022 | Eastern University"',
    },
  },
  {
    id: 'sigchi-virtual-summer-school-2020',
    type: 'event',
    date: '2020-06',
    datePrecision: 'month',
    title: 'ACM SIGCHI Virtual Summer School 2020, Bangladesh',
    description:
      'Postponed from March 2020 by the COVID-19 outbreak, the virtual summer school ran in June 2020 to help young researchers, practitioners, and students from Asia understand research methodologies relevant to CHI and CSCW.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "ACM SIGCHI Virtual Summer School 2020, Bangladesh"',
    },
  },
  {
    id: 'virtual-asian-chi-2020',
    type: 'academic',
    date: '2020',
    datePrecision: 'year',
    title: 'Virtual Asian CHI 2020',
    description:
      'The Asian CHI Symposium showcases HCI work from Asia, the Asian diaspora, and work incorporating Asian sociocultural factors.',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "Virtual Asian CHI 2020"',
    },
  },
  {
    id: 'historical-places-visit-2020',
    type: 'community',
    date: '2020',
    datePrecision: 'year',
    title: 'Historical Places Visit 2020',
    description:
      'A visit to Pakutia, Baliati, and Teota Zamindar Bari in Manikganj to learn the history of Bengali culture and understand the people of the surrounding areas.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQXQHkx7VwfDdRZMJTaZNXzO0VG7_awMet0vJLjO2BcTRF96c5fBp6Fc1odzQ8LBIP4XLu3VhY_OgJ8vp3c4MPjQp3vqMbyHKsGNtv0ZSbMQFADkMpi8WDFthPYEOOqPvmTxCMCJIYxU9sHyfXN5GM9DR3e1WF3A9J9J7-SWLZegAQipQYbjzdbYrYVspmLKYMc5tPE1TRAs1tAW1K4=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "Historical Places Visit 2020"',
    },
  },
  {
    id: 'saraswati-puja-planning-2020',
    type: 'event',
    date: '2020',
    datePrecision: 'year',
    title: 'Planning Discussion During Sharashwati Puja 2020',
    description:
      'Academic and industry researchers discussed yearlong planning and research between NSUHCI and the Dhaka ACM SIGCHI Chapter, then joined the Sharashwati Puja programme.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQVyV_o52X19RFXNkqUgvfu7uOAjFF_WWzFj9F9njIU51v5DIGkmuPTY59hz_HR2dHyjL1iDyUy8PEqGDooZ0h8LCn1Jv0mk1gMGL0fgff1wbr2DpgwaryMd_E7snVNheNWvm4bTyd1VW2qMP-76suq26JZ0zu-MzUCLLJTTtAGBU1VNTW1Aupe52rJc4WzViHlSnegD4gbAelJ6gNQ=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "Planning Discussion During Sharashwati Puja 2020"',
    },
  },
  {
    id: 'sigchi-winter-school-2019-bangladesh',
    type: 'event',
    date: '2019-11',
    datePrecision: 'month',
    title: 'ACM SIGCHI Winter School 2019, Bangladesh',
    description:
      'Organized in November 2019 in anticipation of CHI 2021 in Japan, the winter school encouraged researchers and students from Asia, with a focus on the Global South, to submit quality papers to CHI and other HCI conferences.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQXm8_Ht1OrK-0jkdeag3i4JlTxBltKVVvuOzTMIlBobZmZQIKSDn25-xkQKiq6PDcZMNzNpuuz6KOydH_rDR-JSiuZbfVa16JWXHzAqwGQkVY3eO6_42wJ-s9LRFUYjDnmAV751_0NB84_wyybX1qAD5NFnLpXS6oyHei2tgHKgGHwi4ckm3kNELo3DKapehlTzufU2t97MSrY36TI=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "ACM SIGCHI Winter School 2019, Bangladesh"',
    },
  },
  {
    id: 'cscw-asia-winter-school-2019',
    type: 'academic',
    date: '2019',
    datePrecision: 'year',
    title: 'CSCW Asia Winter School 2019',
    description:
      'The winter school in Kyoto gave students and researchers from the Asia-Pacific region a broad understanding of the topics, methods, and values of CSCW research.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQVHnVaIm-ur6uE9b54CEoxSGpVVGtypjoUfC9lgJwZh_p18T6-zzX-m9W7xsMg1MbNKkvC0pAjeaFbDH7wZRpfOOp8RlM9pkrFCgyJP0F3CTpg2qqQkanoqZFHABidRfqcAYwdZL9ZpfWGW3jav83Ol-L8mQfbHH0Zilz8BDNujOaOeHFtimmq7y6UcX-XQxF_Av8Xtrl9K-0FIaEM=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "CSCW Asia Winter School 2019"',
    },
  },
  {
    id: 'ieee-tencon-2019',
    type: 'academic',
    date: '2019',
    datePrecision: 'year',
    title: 'IEEE TENCON 2019',
    description:
      'A presentation at TENCON 2019, the flagship international technical conference of IEEE Region 10, in India.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQWhb7meEUNiGtHq9W432Ai_YLXx8cOjBcdYg9GOvVfFCMgCZCHPBdL2u3hZ5wAvkODpH6uwZ7JmInwzUAVt0SYnAOrTDNkNE_FHL6d5sYyOsl5qA-gQVHdkoq4WTu4IvDgj5EF06LIokfPgtQP5BiqcFVL1ePTqwSPFFAVO8gdzkBy9a7Yl_FUptbI3WOAR1j4ddDqxhJPEsjU0EHA=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "IEEE TENCON 2019"',
    },
  },
  {
    id: 'grace-hopper-2019',
    type: 'academic',
    date: '2019',
    datePrecision: 'year',
    title: 'Grace Hopper 2019',
    description:
      'Bangladeshi researchers at the Grace Hopper Celebration in Florida, the world’s largest gathering of women technologists.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQXBvWvKJOzryJB4UFEVXxvu7qWAMa4xF8aTlrmVTcAzYrQZO6RYVTo8pYixPuHNFhrSDCHgM8CdMdzEZi1HXJMQw5SOK53E70ppA19iCm6y5sdRQQtpby-fCRm3slflv4RrAjIEowvNk2GTTG9E-kvsJnh0uYvCzIaUjO1I5qobrzK6wPDOq-8MtTRY_661aG9ISKJ07ijbztTC=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "Grace Hopper 2019"',
    },
  },
  {
    id: 'hcai-summer-school-2019',
    type: 'academic',
    date: '2019',
    datePrecision: 'year',
    title: 'ACM SIGCHI Summer School on Human Centered AI 2019',
    description:
      'A summer school in New Delhi supporting HCI researchers who work on or with AI-related research and products.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQVIuywDFtXr6VWwqooaKj22r03jJmmpcwU9dd74z8MTLmtdavDwPZH1oEmbcvGjV5cKp_58Jbibc4J--eP29YPTCUhFVBXer-otyhbgkidQtTsU0AC6yDR8nIsHnLc6Fdq4SKgwWHODeewm7bDrCtYEsWTB5JIyKcqIxuA2yFUCXRsWDlOt6eiRPEK-jIrOsuXKKC1jJ6O38pN4=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "ACM SIGCHI Summer School on Human Centered AI 2019"',
    },
  },
  {
    id: 'asian-chi-2019',
    type: 'academic',
    date: '2019',
    datePrecision: 'year',
    title: 'Asian CHI Symposium 2019',
    description:
      'The Asian CHI Symposium at CHI 2019 in Scotland showcased HCI work from Asia and the Asian diaspora.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQV0RZbkIUnkbhOG4Wz9vKwEnHgOyvkISuQIrhbuteFQBs1DEyQqawFz7uGjij4-6-uL5gAqhR32_enr6uAsUz7jhKObRw40gqwtHLZA4tHmhVCVlJ275x2j8RD6byhMEQq-Rzd3vFIf2XfoG9pXhYPKVBYh4s-3LBlqCvcHDv8HUyxxSsy8wiyV_mBx6nijXC2hXiE5wyESwxH0-z4=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "Asian CHI Symposium 2019"',
    },
  },
  {
    id: 'chi-2019-bangladeshi-researchers-meetup',
    type: 'community',
    date: '2019',
    datePrecision: 'year',
    title: 'CHI 2019 Bangladeshi Researchers Meetup',
    description: 'Bangladeshi researchers met at CHI 2019 in Scotland.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQXdKSkJeY6Fp04RQSTt9Hr0OmcJfl717TSFPLtdxD7X7Wqwi3hW7YyiW2N3UXyEjnLf6fBdiRU1brdHDTOmzKl6F_VmisjmQCFr1g15br-crEsdkSyl56NsWpKj8hzFY5XuWTc2Ish7zwfMvPBTgqgx4b8KEcbxo97nOi1UkOuSbFw-bmy-7eRLvazpv_NTh7rJGUnq26AFlw=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "CHI 2019 Bangladeshi Researchers Meetup"',
    },
  },
  {
    id: 'summer-school-meetup-chi-2019',
    type: 'community',
    date: '2019',
    datePrecision: 'year',
    title: 'Summer School Team Meetup at CHI 2019',
    description: 'ACM SIGCHI Summer School attendees met at CHI 2019 to discuss future research.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQViJFhcq9guR3B6C08X9cbHJzDEOHMjf6iz2e9HjleXkqYKrT-_dmXM7bVKx-8KdfkKTQlr3eHpWlQ_TXFKnn7ZlECLoDM0GHZrIzpGGCxf8Aokw8_3IPBRFwgZgEPANeAxjWgfUYkKmpKM_Yh64kHIcSlh-Umh2QmwwYfVZYtTZqeyhWJAEOgF_410ZLqn1yyzTss4ibbnd76t=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "Summer School Team Meetup at CHI 2019"',
    },
  },
  {
    id: 'hcixb-chi-2019',
    type: 'academic',
    date: '2019',
    datePrecision: 'year',
    title: 'HCI Across Borders, CHI 2019',
    description:
      'The HCI Across Borders symposium at CHI 2019 in Scotland builds bridges across under-served communities and diverse populations within HCI.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQWx0rT0wZk67ucVDIzSwcWYHCEn_ZNoeRSivcoBwizDx_2GrHXdQYCIubB64wDy_z9NY6wVbCgQ6O9B8dTQRyv7yM53srE3j2wkHAweO0vR3YbLSufpkVV-OYl9FXbXdXDf4CqseodMmNcnS2ZAKFpSYrsYnDNcOyY4L4qM9p_2U1k0StCvpNDjZnKV8c6TDfPk1y_YNykZHi8Lsec=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "HCI Across Borders, CHI 2019"',
    },
  },
  {
    id: 'discussion-on-design-2019',
    type: 'event',
    date: '2019',
    datePrecision: 'year',
    title: 'Discussion on Design 2019',
    description:
      'UX designers from the Netherlands joined the Sharashwati Puja at North South University and discussed industry UX research with academic researchers in Bangladesh.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQXyaVqmKtbekPUw1fi69HY68qeV9h35aHBAv1eBasrFBxl0jXEsfuFiZ1FOA545ohfuy9V4Uuu1DC6DuVGaeWCsoxvwdL8wFIaeN-haZ1izdlkD2XSwyIangdWSEFk6Bd_ZZmdUPjDpiajCn90Fvj7bH4xWv8e3eeu6H-w_j_J8bwshPAX06qJh7NOSbeqsEc__AmEnz79TD8hK=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "Discussion on Design 2019"',
    },
  },
  {
    id: 'sigchi-summer-school-2019-bangladesh',
    type: 'event',
    date: '2019',
    datePrecision: 'year',
    title: 'ACM SIGCHI Summer School 2019, Bangladesh',
    description:
      'Held at NSU with the Dhaka ACM SIGCHI Chapter, the summer school aimed to fill knowledge and skill gaps for students interested in HCI and lay the ground for an HCI community in Bangladesh.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQXc_CxlAHEyoyoh_MYhby5BHxNfRlxUNWCmDgt88Idi5jR1EgcwZU8V9Rh7YLIjaO5XMNAVAvBS3zXzboaTnpqLPQlZYj9hgjIaO4mB2E-qGDkalQe97ghylCB9OomrfoFmL3Nl1vytlHwJn38lv-Mj4xAO4ZpL4gYOuHQP9YutbSIHoJkKxPJONBDz6Ff6WD320eFnJEHFHvO0TiE=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "ACM SIGCHI Summer School 2019, Bangladesh"',
    },
  },
  {
    id: 'comsnets-2019',
    type: 'academic',
    date: '2019',
    datePrecision: 'year',
    title: 'COMSNETS 2019',
    description:
      'At COMSNETS 2019 in Bangalore, "Monitoring Driving Stress using HRV" by Rahat Jahangir Rony and Nova Ahmed received an award.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQWcjyvsSCjrt2ed9XPL3xBedZe-fOAxwPI_EwhEbVaEokeU8sP2grfJIn_pfpr2q1ilons0WzyncDX63BxN_hlvxXRNm6U1VHmw_sygP-tYoCjPiLrIps9kZeEcnsotOUgl-l9HyptOqrJd7afiXdWLL7lu4erGpFgDUyz_Af79OLozpBBWEIlyBmi2NY1Ck_m9ktfJS4R-SqycDpc=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "COMSNETS 2019" (photo caption: "Best Poster Award, COMSNETS 2019, Bangalore, India")',
    },
  },
  {
    id: 'broadening-participation-workshop-2018',
    type: 'event',
    date: '2018',
    datePrecision: 'year',
    title: 'Broadening Participation Workshop 2018',
    description:
      'A workshop connecting emerging and experienced researchers to increase the involvement of women, researchers from developing countries, and underrepresented minorities in ubiquitous and wearable computing.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "Broadening Participation Workshop 2018"; organized at UbiComp, Singapore (nova-ahmed-personal-site/collaborations.md)',
    },
  },
  {
    id: 'ubicomp-2018',
    type: 'academic',
    date: '2018',
    datePrecision: 'year',
    title: 'UbiComp 2018',
    description:
      'UbiComp 2018 in Singapore, a premier venue for ubiquitous and pervasive computing.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQWWCqVo0QhH1aIu458mLKjugJ01lSnBmTXL-FGxw0BCUpzv9mr1ggJbduovxfMM1aJbG6IAfCSz6kZWGrRsxLBSu30pezRba3LzhHCYRg6ZfxYPPzxy8Kpwhn7OOwRL_aRiQ_oPOCmwEZ7--jaU2ez7juyCZi0bJYT6r9fm6taWek8YSKhlpxvMH9ygNx2uMP133Wue97dYYh8haiA=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "UbiComp 2018"',
    },
  },
  {
    id: 'mobilehci-2018',
    type: 'academic',
    date: '2018',
    datePrecision: 'year',
    title: 'MobileHCI 2018',
    description: 'MobileHCI 2018 at the University of Pompeu Fabra, Barcelona.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQVFqAtqlwgjEeZhYkwB9_t7d4kNsR-VDWyJU5nKNU8KWabdn6s_DfsPZWWoEvP1GZiauHFSoL9dOgimUnyHACabFs7QpT71_VBlpktITeSwrVz_BRCZQZr-9XlZf3mhWW0zmxgdXIsTrnAmHla3fNjN08t3OtVvDQsj0qesUzctTKqMekO-LpMvqRL0nz_Br6JPek2TwsEmggdi=w1280',
    provenance: {
      source: 'scrape',
      sourceNote: 'nsu-hci-current-website/events.md — "MobileHCI 2018"',
    },
  },
  {
    id: 'hci-workshop-nsu-2018',
    type: 'event',
    date: '2018',
    datePrecision: 'year',
    title: 'HCI Workshop at North South University 2018',
    description:
      'Students, academic researchers, and industry researchers discussed possible HCI research scopes to build a strong HCI research community in Bangladesh.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQU2WbVaqmJKupVLAcjNEktztTZpeVjTRECXj-XmLuP2muKf7oPiv2ftq66xeBWK0JoIhzqqPj0qRcOvYJ3yELmFFdG0Gz-DuspNnaNSrQvLDvccvj5Tg3YRBiWrkaZIhATCUdNvJtdpsybLe3TkzQrNeMFGv-s-Th8-499tFFvOJOl14m0vyd3m4oJ8gQNkV5g-8IYdOTPd9EQin2k=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "HCI Workshop at North South University 2018"',
    },
  },
  {
    id: 'bangla-computational-linguistics-2018',
    type: 'academic',
    date: '2018',
    datePrecision: 'year',
    title: '2nd Symposium on Bangla Computational Linguistics 2018',
    description:
      'A symposium at SUST, Sylhet, on research in Bangla natural language processing and computational linguistics.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQV5JCqhrFDSoKzUzP_rbZBBCHlWfCilwDkV5TaaCi-IvcpPLbcav7Uk61_KZqiVOWtxf9Rm9BFH0bfrnoCVP6Gavvii3kEhQz5vQxEsBKdrXX82gPtMIV6yYo6E_zOcAnTuyHjX-zcH0EiEUt7sETRytza3J5TG1y2WC6ChocbXLoeo7AAFQhxvUxJjlFgh90oq7DOltLiFaSWOe9s=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "2nd Symposium on Bangla Computational Linguistics 2018"',
    },
  },
  {
    id: 'summer-school-text-entry-2018',
    type: 'academic',
    date: '2018-05-25',
    datePrecision: 'day',
    title: 'Summer School of HCI Research and Text Entry Method 2018',
    description:
      'A summer school at IIT Mumbai giving new researchers a systematic overview of common HCI research methods.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQUEpS2lcOZnlQQVYlFJQEgM1emeb9qHCAjHcNLs1cQldYJ2FK2YzItF1KN0cUzYmlukz_NXUnHEDPQH4IkgRmbZUgLhAtXe7YqxBT_Bdq3bF53iQz-6gwvsoUO1RIy_3bYjTvpZgaa3L32cTlLE4RGTOPB0atSmqB-XiDaSXmrRPKi1Oc87NotRbW7pmsE5_0ixOS-DNHrM2DjPNkM=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "Summer School of HCI Research and Text Entry Method 2018" (date from the photo caption)',
    },
  },
  {
    id: 'hcixb-2018',
    type: 'academic',
    date: '2018-04-21',
    datePrecision: 'day',
    title: 'HCI Across Borders 2018',
    description:
      'At the HCI Across Borders symposium at CHI 2018 in Montreal, "Supporting Missing Daughters" received the Best Poster Award.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQWgzWQ_iztODVlwMDLT-IftRru8cf8TiEQEKceTdIolyOhgKDYoPSSwD156etvvjXLn68dfvGhbcPqXfKUhXBc1szi355zW3z-LY63SkO7a2AdlpTLMhjDETinUYE7St1StMvy_-jsfiHXb_JjOz240W5F85gTsJF40lLjz1D20y7HfynjVIjHN6T68FdrLRzl4UgnNxwzu54AEqok=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "HCI Across Borders 2018"; date and award from nsu-hci-current-website/awards.md — "CHI HCIxB Symposium 2018 Best Poster"',
    },
  },
  {
    id: 'comsnets-asset-2018',
    type: 'academic',
    date: '2018-01-09',
    datePrecision: 'day',
    title: 'COMSNETS 2018 — ASSET symposium',
    description:
      'ASSET, a two-day symposium at COMSNETS 2018 in Bangalore, brought together graduate students from across Asia to present and discuss emerging technologies.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQUyeIZDHVOlC3jNZIrF6LjLN-y5n3l0v6Oaq_uLwT_NHYJ1av9EzxDVyLJNR9xDFMoFIxundf0ijwwth82k-FlozC0LoVaY-ZdzWp7LpWBtvHJS5hEFzrqzEy4aeZo-wU7LAbmpsbprZ38koPhuzEpZZG8qqNjZcIU_ld3BwLhI9i6jU9y5r6iIE58ulooHlP85_4cafeOr_1J9__I=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "COMSNETS 2018" (date from the photo caption "ASSET, January 9, 2018, IISC, Bangalore")',
    },
  },
  {
    id: 'google-gender-technology-research-2017',
    type: 'academic',
    date: '2017',
    datePrecision: 'year',
    title: 'Google Gender and Technology Research in Bangladesh 2017',
    description:
      'An HCI research project by Google and North South University on the challenges women in developing countries face using technology, reaching women in three regions of Bangladesh.',
    photo:
      'https://lh3.googleusercontent.com/sitesv/AG8ngQX3PDwIjhiwBy6D_qhgMURb66Ngll35o23Y7g0SYtMv3bVLzCw8sGgJN6CQlaJQ9denVtv1O4uwoD8jTkai4NtNYTOEx0QZStdsFD-lKJ7Xy_MV3RlECHOUS9vgJu6rYZFax_XW4Hu6oSEgC1RSQmabzZpHN93sqPa1Hf6oBuE9HHxrzwxp3X4-lH_Jby7KkSEloXuTp00_dHuN=w1280',
    provenance: {
      source: 'scrape',
      sourceNote:
        'nsu-hci-current-website/events.md — "Google Gender and Technology Research in Bangladesh 2017"',
    },
  },
]
