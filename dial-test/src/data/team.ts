import type { Team } from './types'

/**
 * Fixture team: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const team: Team[] = [
  {
    id: "nova-ahmed",
    slug: "nova-ahmed",
    name: "Nova Ahmed",
    firstName: "Nova",
    lastName: "Ahmed",
    title: "Professor, ECE Department, North South University",
    role: "director",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "/people/nova-ahmed.webp",
    bio: "Dr. Nova Ahmed is a researcher and faculty member in the Department of Electrical and Computer Engineering at North South University. Her area of interest covers systems and human-centered computing in Feminist HCI, trying to ensure inclusive technology. She is Supervisor of NSUHCI and Chair of the Dhaka ACM SIGCHI Chapter (BanglaCHI).",
    researchInterests: [
      "Feminist HCI",
      "Human-centered computing",
      "Systems",
      "Inclusive technology"
    ],
    socials: [
      {
        platform: "google-scholar",
        url: "https://scholar.google.com/citations?user=rXMM2MwAAAAJ&hl=en"
      },
      {
        platform: "website",
        url: "https://sites.google.com/site/novaahmednorthsouthnva/"
      }
    ],
    email: "nova.ahmed@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "researchers",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers → Dr. Nova Ahmed\"; bio paraphrases nova-ahmed-personal-site/home.md — \"Nova Ahmed\"; Scholar link from nsu-hci-current-website/publications.md — \"Google Scholar\""
    }
  },
  {
    id: "tamanna-motahar",
    slug: "tamanna-motahar",
    name: "Tamanna Motahar",
    firstName: "Tamanna",
    lastName: "Motahar",
    title: "Assistant Professor, School of Computing and Informatics, University of Louisiana at Lafayette; Senior Lecturer, ECE Department, North South University (On Leave)",
    role: "faculty",
    affiliation: "university-of-louisiana-at-lafayette",
    affiliationLabel: "University of Louisiana at Lafayette",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQUMn00w4WTeP_epl2V1b-xBcR8qSdLsTs3OOs9J2j1RdBBXdQTechtgJqa8sMPlP0nIAJI3sFmPK3gcYCs-PRFZBf4vF8_VDvFsRsz71oZkhCcTbZkEsIO7y0_rfhWRwmfmRwwfPAo-HO6tdPIABq-tWSNED4kegj7rE-53-OZFGPV6LmAPNM-aP1o7StnoYyM7vKzDkOIMzFO0e2x1dvuYVyRyEIpMHnMPWIjhvwo=w1280",
    socials: [
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/tamanna-motahar-phd-696492153"
      },
      {
        platform: "google-scholar",
        url: "https://scholar.google.com/citations?hl=en&user=CSHkmskAAAAJ"
      }
    ],
    email: "tamanna.motahar@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "researchers",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers → Dr. Tamanna Motahar\". The Proposal lists her as an Interdisciplinary Collaborator instead; role needs confirmation."
    }
  },
  {
    id: "rahat-jahangir-rony",
    slug: "rahat-jahangir-rony",
    name: "Rahat Jahangir Rony",
    firstName: "Rahat",
    middleName: "Jahangir",
    lastName: "Rony",
    title: "Coordinator (NSUHCI) and Researcher, DIAL, North South University; Researcher, Cardiff University; Secretary, Dhaka ACM SIGCHI Chapter (BanglaCHI)",
    role: "graduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQUWDqhUPYGeleKo70BeFVC45wvmUyJXj8K7ZohuBswqNESd6T8pUXE9pnqOQNkZ6zfkvm_6ZkROsUOrLpQcv_1tX_zT2n30FwGWGVqS0Z5CI8xBbxko4ieo9Qb4GGA7o9dwIKWbPeT5sh1v00TTrzQQZMLenX4e88F1lhDGoYO2cFd6PMu9JpiHr_bJXowcRdqcokZsmLJD4BflkpPmgE0D4UhyUa-eWW3ZVzCc=w1280",
    socials: [
      {
        platform: "website",
        url: "https://sites.google.com/view/rahatjahangir/home"
      },
      {
        platform: "google-scholar",
        url: "https://scholar.google.com/citations?hl=en&user=BfxlMtoAAAAJ"
      }
    ],
    email: "ronyr@cardiff.ac.uk",
    displayInWebsite: true,
    nameVariants: [
      "Rahat Rony"
    ],
    rosterSection: "researchers",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers → Dr. Rahat Jahangir Rony\". Also listed under \"Researchers: Study Leave\" (older card) and in the 2022 \"Researchers Pursuing Ph.D.\" list; the current Researchers card is treated as authoritative. Role is the closest LabKit fit (no research-staff role)."
    }
  },
  {
    id: "anik-sinha",
    slug: "anik-sinha",
    name: "Anik Sinha",
    firstName: "Anik",
    lastName: "Sinha",
    title: "Researcher, DIAL; Lab Coordinator and Treasurer, DIAL; Team Lead, Autism Project",
    role: "graduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQVA-OJjX9WqZa8jx4K0a5iTsg6vktbdPris0UAqS5cWal9OhZl9E3IBK35aGwnKeSdf7JFogeB0kcph-4bCrzziGvWfbqWqNVlmh_xhbwGNOhmF8Kk5OFE0IASKhh0o1FA1umRll4pV4lE4FGM0zf7IlIdw1_OAx4NlhPfmhy7G8Of0xvS6aEcaCoKKQnZRsZTXpC43x790ipMX96ly_G1RDgWHYIZGV0TAfn6BPYc=w1280",
    socials: [
      {
        platform: "google-scholar",
        url: "https://scholar.google.com/citations?user=nSORcjEAAAAJ&hl=en"
      }
    ],
    email: "anik.sinha@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "researchers",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers → Anik Sinha\". Role is the closest LabKit fit (no research-staff role)."
    }
  },
  {
    id: "anik-saha",
    slug: "anik-saha",
    name: "Anik Saha",
    firstName: "Anik",
    lastName: "Saha",
    title: "Researcher, DIAL; Project Planning & Implementation Coordinator; Team Lead, Familiarization and Co-Learning Project",
    role: "graduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQW8fNwtVMA1iNFLeFFnW317_Pcxd7HKlJArchhAe8ympwdGggx-koKma_MR4WQb2O_LAj_7QUJKkdSQ7Wrw5UV7GU5oLUXL7-Bu4puloSFEfCOdqL-Oj9InZoUmd0NZ5AYc2ORQDOvv4KRZUbVD8jpxhE0czIvKptusLKsL3It1cSQHQAWSLEEiwBshzT_tgDdoyXGGr9bnzyVnMmhFFded-XM8ampUWdCyGWFi=w1280",
    socials: [
      {
        platform: "google-scholar",
        url: "https://scholar.google.com/citations?hl=en&user=fllXTssAAAAJ"
      }
    ],
    email: "aniksaha@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "researchers",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers → Anik Saha\". Role is the closest LabKit fit (no research-staff role)."
    }
  },
  {
    id: "ifti-azad-abeer",
    slug: "ifti-azad-abeer",
    name: "Ifti Azad Abeer",
    firstName: "Ifti",
    middleName: "Azad",
    lastName: "Abeer",
    title: "Researcher and Research Coordinator, DIAL; Team Lead, Credit Scoring Project",
    role: "alumni",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQUdrD4IeQI2zucjVUSwvKYjvPCKAiKJft-Ni239gbwSyEML9oe8vE3VBrF3qX5J1K7wK1dzKygfkayw4B2-uCUz9mcC-t1Y5IkMcqOHmReXLBzNWygIkdPNiXKOoAspke5zGlf-6jrTVq6gSKVrKzM7OoIeQ7eLfNXz4l7SZD2qv_X2R4ODAC6eUl7Wd82R2Lt9loIzQmPYQSTjq_k=w1280",
    socials: [
      {
        platform: "google-scholar",
        url: "https://scholar.google.com/citations?user=aZESbPcAAAAJ&hl=en"
      }
    ],
    email: "ifti.azad@northsouth.edu",
    displayInWebsite: true,
    alumniYear: 2026,
    currentPosition: "Ph.D. in Computer Science, University of Louisiana at Lafayette, USA (from Fall 2026)",
    nameVariants: [
      "Ifti Azad Abber"
    ],
    rosterSection: null,
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers → Ifti Azad Abeer\" for card and photo; nsu-hci-current-website/people.md — \"Researchers Pursuing Ph.D. and Postgraduate Studies → 2026\" (\"Ifti Azad Abber\", treated as the same person) for the move."
    }
  },
  {
    id: "monisha-dey",
    slug: "monisha-dey",
    name: "Monisha Dey",
    firstName: "Monisha",
    lastName: "Dey",
    title: "Research Assistant, DIAL",
    role: "alumni",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQXGAzZlRkG3Wt8XgWXBAWJcFwOsKWpPoV-TUBF9uy4lB0Erpp18rJO0nVeInat6YRNGgGJVANOblOAiB8W-IBFfi9BDTB-GYXAOdKhoV7eqiC4QApCZ52AcUH8_-VYmnsbh4edxul10obxv0njjkl8cyihMugVBgEzCg7PYfKn3B7N-FXc1a7NTuv3ZH9fEviPY-EV7TILiiyv5WNaaIM-m6MTAAFwhXSdh1x-b=w1280",
    email: "monisha.28dey@gmail.com",
    displayInWebsite: true,
    alumniYear: 2026,
    currentPosition: null,
    rosterSection: null,
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Graduate Student Researchers → Monisha Dey\"; listed under nsu-hci-current-website/people.md — \"Researchers Pursuing Ph.D. and Postgraduate Studies → 2026\" with no destination given."
    }
  },
  {
    id: "manoshi-das-turjo",
    slug: "manoshi-das-turjo",
    name: "Manoshi Das Turjo",
    firstName: "Manoshi",
    middleName: "Das",
    lastName: "Turjo",
    title: "Research Assistant, DIAL",
    role: "graduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQUKoCUF0BaLppYmQwOmf4FdVaPx1RBJBO2Hkab30EumNpY7mB7RvFIGfgGgA4dkccHTKpVzGcfQlgHJMWmfvgMO0qTM1WbVqWfTWWSXSyxT1mTSKEy6hjjhlDiIYln5MZToGnY1Tggd7lrudi8vjpSXkFufk8b2HLLjPS97NWuhHzLJZoMXt_VV4YLcGlFkNdTin1ZkRsJpW76_gnzgyt5ZJ2c6wX34H9LAcC7q=w1280",
    email: "manoshi.turjo@northsouth.edu",
    displayInWebsite: true,
    nameVariants: [
      "Manoshi Das"
    ],
    rosterSection: "graduate",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Graduate Student Researchers → Manoshi Das Turjo\""
    }
  },
  {
    id: "moostazi-maisha",
    slug: "moostazi-maisha",
    name: "Moostazi Maisha",
    firstName: "Moostazi",
    lastName: "Maisha",
    title: "Research Assistant, DIAL",
    role: "graduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQVpfzqtgIGHSxUxrW4YCQQkuLbFyNyvdDOIoZ3tGOXsH4XGnEYOq4jV375kdmNdxCYET9nQLX3XBOEQAfEMjTBpRIFkKPEVscpEYgFNDo8iwYEjj72WiZXf2AfZSIX4aOq9iOaMNngDMhefApMT1bn8la-FOuxK5dF64M8EwBeayG6BJxqMXA3Ev3hvoTrh-D3XRUvmJoMzH0S6NEi0H6sGUgzC3zZ657qMRembtA0=w1280",
    email: "moostazi.maisha@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "graduate",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Graduate Student Researchers → Moostazi Maisha\""
    }
  },
  {
    id: "farhan-ahmed-fahim",
    slug: "farhan-ahmed-fahim",
    name: "Farhan Ahmed Fahim",
    firstName: "Farhan",
    middleName: "Ahmed",
    lastName: "Fahim",
    title: "Research Assistant, DIAL",
    role: "undergraduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQUUXpPohOV0WQmRz_dRW4M_4i0z3uxViPv2ms4Oj3LPgUF36Hjqx6SeFxfhaiPlxzdtrjiswtkkQbBrrM1GQfsk7ztJ9MlY20a1gPSUR-ghWRknCxyF2TkOd860wExBydqaRUGSFZgcz33whGk71-LNmKo6sXs2U4n_oEq9r_Flak7qNOO3623io-hgY3XYbngEFWBT4uWLYQl-5mAk2mYXIcD908YRQZ_5YBEB9q4=w1280",
    email: "farhan.fahim01@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "undergraduate",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Undergraduate Student Researchers → Farhan Ahmed Fahim\"."
    }
  },
  {
    id: "eusra-amreen",
    slug: "eusra-amreen",
    name: "Eusra Amreen",
    firstName: "Eusra",
    lastName: "Amreen",
    title: "Research Assistant, DIAL",
    role: "undergraduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQWYg2QASPPcj3bjy-IEEdGPHYJRlpwK2rLc0aEJEFhjM7zNezsYh-CgWdUew_0J4UpBhBWPENlep_GxNyb7XiiQQLbkAgKWAB60vIZEoYZIZgGs1llCDH-hPT9_tPB7yFVe5ypxQGCZIuwrFpkMWf_YeC7ddBGhka3IYCviL-1oZ61qzVgOt6Eg8bO-RgHyLwJT-zKuRadU7_1psh_TWRODgPXgxPV4hnt2srtT=w1280",
    email: "eusra.amreen.232@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "undergraduate",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Undergraduate Student Researchers → Eusra Amreen\"."
    }
  },
  {
    id: "mahir-morshed",
    slug: "mahir-morshed",
    name: "Mahir Morshed",
    firstName: "Mahir",
    lastName: "Morshed",
    title: "Research Assistant, DIAL",
    role: "undergraduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQWEeZjl9xQD5NVx5AjIpVwG9KrsKSU9UpsH-fcV6yY4dwwvvETGcLdl9WnoioIpjpzPdwP60BPxVXnaaIB7P3Q3JX7IaT2bUg_u_yC1X8xR9yGgFVDM37wimw8QbmLda6Y0cpLy_1uqKoyX_ezEpcXUK4ALadjcaMp514TDr6aBB3qJlGCjMKx2rqyh8shOWFiOGXjaNL-bru8f9MnYWK-p5gJPzPbIewgPavoKHRY=w1280",
    email: "mahirmorsh@gmail.com",
    displayInWebsite: true,
    rosterSection: "undergraduate",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Undergraduate Student Researchers → Mahir Morshed\"."
    }
  },
  {
    id: "arefa-khandaker-rifa",
    slug: "arefa-khandaker-rifa",
    name: "Arefa Khandaker Rifa",
    firstName: "Arefa",
    middleName: "Khandaker",
    lastName: "Rifa",
    title: "Research Assistant, DIAL",
    role: "undergraduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQW3DjRonmOgjA5eY4elACbpVlUE_7PARnspRWT1lPCiybxyKDz6otI9RUwLIpnXySGk5VInfNi1MDumzMNR2mTHJd30PfkWgTOn1YBaI9h3cjQLquaQICKQEvVN91LdcwIgBKpqtwjQDry1pdeyujR5iJY2NYIZQVwYZ4Wmj2os-R-vhY1W_o8jEql-YmkXCt69BR8TxQWWqYrhIhq-MPQnvlz7o9ot09ITy87MuGg=w1280",
    email: "arefa.rifa.242@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "emerging",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Emerging Student Researchers → Arefa Khandaker Rifa\". LabKit has no \"emerging\" role; undergraduate-ra is an assumption."
    }
  },
  {
    id: "marzia-mahian-hridi",
    slug: "marzia-mahian-hridi",
    name: "Marzia Mahian Hridi",
    firstName: "Marzia",
    middleName: "Mahian",
    lastName: "Hridi",
    title: "Research Assistant, DIAL",
    role: "undergraduate-ra",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQVC-uWaKbh15__GCKAPGk_TIzShomaeFZ5UarFLU2sWAbHeCJsER1tJM8WhItzZDLmqBmL3fBsrilhfzcfGIkVjOSS7H2NO6_Sf3yWcq0JhgzOXnPj4TwvXZ8Ya1FuDoPQll4VTGrYbxgu1G_e1txmevBRxr_wUT9Phk3eo4RJWXvuycZHFzU3DvUrXI8zynhVHdp19Bm5JVtqszOivoEB_EOakcy510o8AThkRy8c=w1280",
    email: "marzia.hridi@northsouth.edu",
    displayInWebsite: true,
    rosterSection: "emerging",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Emerging Student Researchers → Marzia Mahian Hridi\". LabKit has no \"emerging\" role; undergraduate-ra is an assumption."
    }
  },
  {
    id: "syeda-shabnam-khan",
    slug: "syeda-shabnam-khan",
    name: "Syeda Shabnam Khan",
    firstName: "Syeda",
    middleName: "Shabnam",
    lastName: "Khan",
    title: "Former Research Scientist, DIAL, North South University",
    role: "alumni",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQUcEd1LSxC7Ygs-Kef9xWQ63wbpRgfSQqbcZE1yV_IR8VylFCZO-f4w9MfgjD9se1KZj-74JfcJHRpYiFCOG5jcGYCDREFGCHuh60_SYlEvvvbhvh-HBVRqNyHAJceoNN6zMp1wz_38Dfv0UlkkAs0579h6iwQqkW-eTe_zIdIggPfcAbhsgL8A2O8ZOqV7RkoQyN6iAUDXih28=w1280",
    email: "syeda.khan@northsouth.edu",
    displayInWebsite: true,
    alumniYear: 2023,
    currentPosition: "Post Graduate Student, RMIT, Australia",
    rosterSection: "study-leave",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers: Study Leave → Syeda Shabnam Khan\"; alumniYear is the earliest year under \"Researchers Pursuing Ph.D. and Postgraduate Studies\" (2023)."
    }
  },
  {
    id: "md-sabbir-ahmed",
    slug: "md-sabbir-ahmed",
    name: "Md. Sabbir Ahmed",
    firstName: "Md.",
    middleName: "Sabbir",
    lastName: "Ahmed",
    title: "Former Data Scientist, DIAL, North South University",
    role: "alumni",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQXtkUp25FbfkQ5EsF33LhnVmBjzfDxfH0BLaI-tnqp6559hoKDHdXYqoTpSR4D4jmI3ybgU4pqOV5wCLgGyo112GnWRe24G6dlcSGsdtBfJc66t0NPl8DyiPJVC9Ijx7YvpSVj60n2V9Um27pJkZSrCALPuMWaMptHnBONftBtx4Pm7cwaa76BC93ZgS_daWa6QPPEviee5natfElp_uwYJY0J_tYlNOC2TfBRpqcw=w1280",
    email: "sabbir.eu.39@gmail.com",
    displayInWebsite: true,
    alumniYear: 2023,
    currentPosition: "Ph.D. Student, University of Virginia",
    nameVariants: [
      "Sabbir Ahmed",
      "Md Sabbir Ahmed"
    ],
    rosterSection: "study-leave",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers: Study Leave → Md. Sabbir Ahmed\"; alumniYear is the earliest year under \"Researchers Pursuing Ph.D. and Postgraduate Studies\" (2023). Card name is \"Sabbir Ahmed\"; the 2023 list and the Mon Majhi page say \"Md. Sabbir Ahmed\"."
    }
  },
  {
    id: "tahsin-mayeesha",
    slug: "tahsin-mayeesha",
    name: "Tahsin Mayeesha",
    firstName: "Tahsin",
    lastName: "Mayeesha",
    title: "Former Researcher, DIAL, North South University",
    role: "alumni",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQWCi0RfToAhfglNnzFFHu8Vcxf-MIlgMp-HmSMEvQmuMQX9RBpjXTmX9E1313g288oJ-xIFzpAQVe4zlaSx7qSEdwsh3entonXH4AUKlr7DMDd3FZEGbh8TCHbgJIJCEXXajmscahkUer9R_VY9IL8wtSWlKLy6edkOzrKRzhkI7CNs6z0qg2_G6ph2QUAf1f1GMCDsIJh4A26zLVc=w1280",
    email: "tasmiah.tahsin@northsouth.edu",
    displayInWebsite: true,
    alumniYear: 2025,
    currentPosition: "Ph.D. Student, University of North Texas",
    nameVariants: [
      "Tasmiah Tahsin Mayeesha"
    ],
    rosterSection: "study-leave",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers: Study Leave → Tahsin Mayeesha\"; alumniYear is the earliest year under \"Researchers Pursuing Ph.D. and Postgraduate Studies\" (2025). Publications list her as \"Tasmiah Tahsin Mayeesha\"."
    }
  },
  {
    id: "rio-chakma",
    slug: "rio-chakma",
    name: "Rio Chakma",
    firstName: "Rio",
    lastName: "Chakma",
    title: "Research Associate, IDLC, Bangladesh",
    role: "alumni",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: "https://lh3.googleusercontent.com/sitesv/AG8ngQUVBYR5L44nXnUg7jCwedCjqq2D4-cpSirNW_hqforQjX3B6y0fUIekTIQw_C5lbcP1003ZrSSyjehBKqqdfdbHQtraJLATV1hsOMLM7coOrl_fsYWwukl8MqUhIJdZzc2Iup43xOgg9_nGWEEgOEHLFtkm4eVhqqzRG48Yad_HC22DTcniIRRZGaKr4xQzX-NucvP1ItwWTCJQFIM=w1280",
    email: "riochakma@gmail.com",
    displayInWebsite: true,
    alumniYear: null,
    currentPosition: "Research Associate, IDLC, Bangladesh",
    rosterSection: "professional-leave",
    provenance: {
      source: "scrape",
      sourceNote: "nsu-hci-current-website/people.md — \"Researchers: Professional Leave → Rio Chakma\". The page does not say \"Former\"; \"Professional Leave\" is read as no longer active."
    }
  },
  {
    id: "salekul-islam",
    slug: "salekul-islam",
    name: "Salekul Islam",
    firstName: "Salekul",
    lastName: "Islam",
    title: "Professor, ECE, North South University",
    role: "faculty",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: null,
    email: null,
    displayInWebsite: false,
    rosterSection: null,
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Ongoing Supervision Structure\" (\"Member\"). Not on the current People page, so hidden. The Mon Majhi page instead calls him \"Prof. Salekul Islam, UIU\"."
    }
  },
  {
    id: "lamia-iftekhar",
    slug: "lamia-iftekhar",
    name: "Lamia Iftekhar",
    firstName: "Lamia",
    lastName: "Iftekhar",
    title: "Women in STEM collaboration",
    role: "external-collaborator",
    affiliation: "nsu",
    affiliationLabel: "North South University",
    photo: null,
    email: null,
    displayInWebsite: true,
    rosterSection: null,
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/collaborations.md — \"Women in STEM Collaboration\"; the Proposal lists her under \"Past Collaborators\" as \"Dr. Lamia Iftekhar, NSU\"."
    }
  },
  {
    id: "nithya-sambasivan",
    slug: "nithya-sambasivan",
    name: "Nithya Sambasivan",
    firstName: "Nithya",
    lastName: "Sambasivan",
    title: "Collaborator, gender equity in technology",
    role: "external-collaborator",
    affiliation: "google",
    affiliationLabel: "Google",
    photo: null,
    email: null,
    displayInWebsite: true,
    rosterSection: null,
    provenance: {
      source: "scrape",
      sourceNote: "nova-ahmed-personal-site/collaborations.md — \"Collaboration with Google\"; the Proposal lists \"Dr. Nithya Sambasivan, Google\" under \"Past Collaborators\"."
    }
  },
  {
    id: "munir-hasan",
    slug: "munir-hasan",
    name: "Munir Hasan",
    firstName: "Munir",
    lastName: "Hasan",
    title: "Interdisciplinary collaborator, Women in Tech",
    role: "interdisciplinary-collaborator",
    affiliation: "bdosn",
    affiliationLabel: "BDOSN",
    photo: null,
    email: null,
    displayInWebsite: true,
    rosterSection: null,
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Interdisciplinary Collaborator (21)\": \"Munir Hasan, BDOSN Area: Women in Tech\"."
    }
  },
  {
    id: "shameem-ahmed",
    slug: "shameem-ahmed",
    name: "Shameem Ahmed",
    firstName: "Shameem",
    lastName: "Ahmed",
    title: "Co-PI, autism parent–teacher grant",
    role: "external-collaborator",
    affiliation: "western-washington-university",
    affiliationLabel: "Western Washington University",
    photo: null,
    email: null,
    displayInWebsite: true,
    rosterSection: null,
    provenance: {
      source: "scrape",
      sourceNote: "DIAL Proposal.md — \"Past Collaborators\" (\"Dr. Shameem Ahmed, WWU\") and \"Funding Information\" (Co-PI, CTRG-22-SEPS-01)."
    }
  }
]
