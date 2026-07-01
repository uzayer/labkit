import { Suspense } from 'react'
import { PublicationsSectionWithUrl, type PublicationYear } from '@/components/publications1'

const publications: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: '1',
        title: 'Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh',
        authors: 'Nova Ahmed, Raisa Islam, Tanvir Hossain, Md. Shafiul Alam',
        venue: 'CHI',
        award: 'Best Paper',
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Islam, R., Hossain, T., & Alam, M. S. (2024). Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh. In Proceedings of CHI 2024. ACM.`,
        themes: ['ICTD', 'Accessibility & Inclusion'],
        isOpenAccess: true,
        isCollaboration: false,
        type: 'conference',
      },
      {
        id: '2',
        title: 'Shathi: Understanding Financial Inclusion Barriers for Women Garment Workers Through a Participatory Lens',
        authors: 'Nova Ahmed, Fariha Chowdhury, Sabbir Rahman',
        venue: 'CSCW',
        award: null,
        pdfLink: '#',
        projectLink: null,
        citationText: `Ahmed, N., Chowdhury, F., & Rahman, S. (2024). Shathi: Understanding Financial Inclusion Barriers for Women Garment Workers Through a Participatory Lens. In Proceedings of CSCW 2024. ACM.`,
        themes: ['ICTD', 'Gender & Feminist HCI'],
        isOpenAccess: false,
        isCollaboration: true,
        type: 'conference',
      },
      {
        id: '3',
        title: 'Alo: Participatory Design of a Crisis Support Tool for Survivors of Gender-Based Violence in Urban Bangladesh',
        authors: 'Nova Ahmed, Nusrat Jahan, Md. Rifat Hasan',
        venue: 'DIS',
        award: null,
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Jahan, N., & Hasan, M. R. (2024). Alo: Participatory Design of a Crisis Support Tool for Survivors of Gender-Based Violence in Urban Bangladesh. In Proceedings of DIS 2024. ACM.`,
        themes: ['Gender & Feminist HCI', 'Safety & Security'],
        isOpenAccess: true,
        isCollaboration: false,
        type: 'conference',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: '4',
        title: 'Mon Bina: Investigating Mental Health Help-Seeking Behaviors Among University Students in Bangladesh',
        authors: 'Nova Ahmed, Lamia Alam, Ishtiaque Ahmed',
        venue: 'SOUPS',
        award: 'Impact Award',
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Alam, L., & Ahmed, I. (2023). Mon Bina: Investigating Mental Health Help-Seeking Behaviors Among University Students in Bangladesh. In Proceedings of SOUPS 2023. USENIX.`,
        themes: ['Mental Health & Wellbeing'],
        isOpenAccess: true,
        isCollaboration: true,
        type: 'conference',
      },
      {
        id: '5',
        title: 'Poisha: Toward Explainable Mobile Money Interfaces for Underserved Communities',
        authors: 'Nova Ahmed, Tanvir Hossain, Md. Rifat Hasan',
        venue: 'UIST',
        award: null,
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Hossain, T., & Hasan, M. R. (2023). Poisha: Toward Explainable Mobile Money Interfaces for Underserved Communities. In Proceedings of UIST 2023. ACM.`,
        themes: ['ICTD', 'Explainable AI & ML'],
        isOpenAccess: false,
        isCollaboration: false,
        type: 'conference',
      },
    ],
  },
  {
    year: 2022,
    publications: [
      {
        id: '6',
        title: 'Barta: Designing Community-Driven Misinformation Correction Tools for Low-Literacy Populations',
        authors: 'Nova Ahmed, Raisa Islam, Fariha Chowdhury, Sabbir Rahman',
        venue: 'CHI',
        award: 'Honorable Mention',
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Islam, R., Chowdhury, F., & Rahman, S. (2022). Barta: Designing Community-Driven Misinformation Correction Tools for Low-Literacy Populations. In Proceedings of CHI 2022. ACM.`,
        themes: ['Infodemic & Misinformation', 'ICTD'],
        isOpenAccess: true,
        isCollaboration: true,
        type: 'conference',
      },
      {
        id: '7',
        title: 'Shikha: Technology-Mediated Peer Learning Among Adolescent Girls in Rural Bangladesh',
        authors: 'Nova Ahmed, Nusrat Jahan, Lamia Alam',
        venue: 'CSCW',
        award: null,
        pdfLink: '#',
        projectLink: null,
        citationText: `Ahmed, N., Jahan, N., & Alam, L. (2022). Shikha: Technology-Mediated Peer Learning Among Adolescent Girls in Rural Bangladesh. In Proceedings of CSCW 2022. ACM.`,
        themes: ['Computing Education', 'Gender & Feminist HCI'],
        isOpenAccess: false,
        isCollaboration: false,
        type: 'conference',
      },
      {
        id: '8',
        title: 'Hawa: Exploring Citizen Science Approaches to Air Quality Monitoring in Dhaka',
        authors: 'Nova Ahmed, Md. Shafiul Alam, Tanvir Hossain',
        venue: 'ASSETS',
        award: null,
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Alam, M. S., & Hossain, T. (2022). Hawa: Exploring Citizen Science Approaches to Air Quality Monitoring in Dhaka. In Proceedings of ASSETS 2022. ACM.`,
        themes: ['ICTD', 'Accessibility & Inclusion'],
        isOpenAccess: false,
        isCollaboration: true,
        type: 'conference',
      },
    ],
  },
  {
    year: 2021,
    publications: [
      {
        id: '9',
        title: 'Bondhu: Voice-Based Navigation Support for Visually Impaired Rickshaw Passengers in Dhaka',
        authors: 'Nova Ahmed, Md. Rifat Hasan, Ishtiaque Ahmed',
        venue: 'CHI',
        award: null,
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Hasan, M. R., & Ahmed, I. (2021). Bondhu: Voice-Based Navigation Support for Visually Impaired Rickshaw Passengers in Dhaka. In Proceedings of CHI 2021. ACM.`,
        themes: ['Accessibility & Inclusion'],
        isOpenAccess: false,
        isCollaboration: true,
        type: 'conference',
      },
      {
        id: '10',
        title: 'Kotha: Designing Voice Interfaces for Last-Mile Healthcare Worker Reporting in Rural Bangladesh',
        authors: 'Nova Ahmed, Raisa Islam, Sabbir Rahman',
        venue: 'ICTD',
        award: 'Best Paper',
        pdfLink: '#',
        projectLink: null,
        citationText: `Ahmed, N., Islam, R., & Rahman, S. (2021). Kotha: Designing Voice Interfaces for Last-Mile Healthcare Worker Reporting in Rural Bangladesh. In Proceedings of ICTD 2021. ACM.`,
        themes: ['ICTD', 'Accessibility & Inclusion'],
        isOpenAccess: true,
        isCollaboration: false,
        type: 'conference',
      },
    ],
  },
]

export default function PublicationsPage() {
  return (
    <>
      <section className="py-32">
        <div className="container">
          <h1 className="max-w-4xl text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            <span className="font-medium">Publications</span>
            <br />
            <span className="text-muted-foreground">DIAL Lab Research Output</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Google Scholar ·{' '}
            <a href="#" className="underline underline-offset-4 transition-colors hover:text-foreground">
              Nova Ahmed
            </a>{' '}
            ·{' '}
            <a href="#" className="underline underline-offset-4 transition-colors hover:text-foreground">
              Ishtiaque Ahmed
            </a>
          </p>
        </div>
      </section>
      <Suspense>
        <PublicationsSectionWithUrl yearGroups={publications} />
      </Suspense>
    </>
  )
}
