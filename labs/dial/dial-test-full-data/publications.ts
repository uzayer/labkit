import type { Publication } from './types'

/**
 * DIAL's publications, generated 2026-09-20 by merging two sources:
 *
 * 1. The NSU HCI-DIAL site's publication list
 *    (labs/dial/scraped-data/nsu-hci-current-website/publications.md) — this
 *    defines which works are DIAL's. 172 bullets; 6 merged as repeats
 *    and 6 excluded as misattributions (see below), leaving 160.
 * 2. Nova Ahmed's ORCID (0000-0002-7715-1742, pub.orcid.org v3.0/works, 138
 *    work groups), used to attach DOIs by normalized-title match. For every DOI,
 *    title/authors/year/venue/type come from Crossref and abstract/open-access
 *    status from OpenAlex, mirroring LabKit's src/lib/ingestion mappers
 *    (Crossref subtitle appended to the title; container-title → venue label).
 *
 * Counts (192 total):
 * - 74 on the NSU list and matched to ORCID (2 of these have no usable DOI)
 * - 7 on the NSU list with a DOI stated in the citation but absent from ORCID
 * - 79 on the NSU list only (parsed from citation text, provenance 'scrape')
 * - 32 DIAL-era (2014+) HCI/ICTD works from ORCID that the NSU list lacks
 *   (provenance 'orcid'); 33 ORCID works excluded (pre-2014 systems work,
 *   preprints of published papers, clinical papers by a different N. Ahmed)
 *
 * Excluded NSU bullets (line: reason):
 * - 336: UK child-safeguarding guide (Burton et al., Wadsworth); "Ahmed, N." is almost certainly a different person.
 * - 453: Materials-chemistry paper (silica aerogel / Zn extraction); "Ahmed, N." is almost certainly a different person.
 * - 455: Clinical radiology paper (Bangladesh Medical Journal); "N Ahmed" is almost certainly a different person.
 * - 460: Edited volume by N. Zaman (Ed.); not a DIAL authorship. Nova Ahmed's chapter in it is listed separately (line 472).
 * - 468: Clinical dermatology paper (Bangladesh Medical Journal); "N Ahmed" is almost certainly a different person.
 * - 474: Chapter by H. Ranganathan in the same IGI volume; no DIAL author.
 *
 * Type refinement beyond the LabKit mapper: CHI/CSCW/UbiComp extended
 * abstracts, companions, adjuncts, posters and demos → 'extended-abstract';
 * JMIR Research Protocols → 'study-protocol'; HCIxB symposium papers →
 * 'workshop'. Authors are one `customAuthor.name` per author in source order
 * (API names for DOI records, citation text otherwise; initials never
 * expanded). `teamMember`, `themes` and `awards` are deliberately unset.
 * `featured` is a prototype display choice (recent/strong CHI, CSCW, TOCHI,
 * ICTD papers), not source data.
 */

export const publications: Publication[] = [
  {
    id: '2026-google-maps-can-say-lot',
    title:
      '"Google Maps can say a lot of things, but it cannot guide us properly": Exploring Technology Inaccessibility for People with Visual Impairments in Bangladesh',
    authors: [
      { customAuthor: { name: 'Eusra Amreen' } },
      { customAuthor: { name: 'Mahir Morshed' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2026,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3772363.3799021',
    externalUrl: 'https://doi.org/10.1145/3772363.3799021',
    isOpenAccess: true,
    abstract:
      'Worldwide, people with visual impairments (PVI) face significant barriers in accessing technologies. These barriers exacerbated in low-resource contexts like Bangladesh due to infrastructural limitations. This paper explores the technology usage and preferences of n=7 tertiary-level students with visual impairments in Bangladesh. The study findings show that the technology-related challenges of PVIs include failure of assistive technologies. Participants shared that they face most inaccessibility while using Navigation technologies due to the infrastructural scenario of the country and lack of contextualization of those technologies. This research emphasizes the opportunity for the navigation technologies to better serve PVIs, particularly in regions with similar socio-technological challenges. This work presents the technology challenges and improvement suggestions of the participants, and outlines the need for participatory design research for more accessible and contextually aligned navigation technologies for this community.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3772363.3799021.",
    },
  },
  {
    id: '2026-beyond-stigma-silence-multilayered-approach',
    title:
      'Beyond Stigma and Silence: A Multilayered Approach to Uncovering Mental Health Challenges Among People with Disabilities in Bangladesh Through Social Media Behavior and Linguistic Analytics',
    authors: [
      { customAuthor: { name: 'Manoshi Das Turjo' } },
      { customAuthor: { name: 'Md. Jahidul Islam' } },
      { customAuthor: { name: 'Zinnat Fowzia Ria' } },
      { customAuthor: { name: 'Hussain Md. Sahariyar' } },
      { customAuthor: { name: 'Md Hasibur Rahman' } },
      { customAuthor: { name: 'Mohammed Arif Uddin' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Salekul Islam' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2026,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'JMIR Preprints',
    doi: '10.2196/preprints.105485',
    externalUrl: 'https://doi.org/10.2196/preprints.105485',
    isOpenAccess: true,
    abstract:
      "BACKGROUND In Bangladesh, approximately 4.742 million individuals, or 2.4% of the population, live with physical or mental disabilities [19]. These individuals often face complex challenges that significantly affect their mental health and quality of life. According to the Centers for Disease Control and Prevention (CDC), adults with disabilities are five times more likely to experience frequent mental distress compared to their non-disabled peers [21]. The intersection of physical disability and mental health is multifaceted; navigating an environment not designed for their needs, experiencing societal stigma, managing chronic pain, and facing inaccessible infrastructure often contribute to emotional distress, anxiety, and depressive symptoms [20]. The mental health struggles of people with disabilities are often overlooked, especially in South Asian societies where mental illness is still stigmatized [1]. When these issues go unaddressed, they can worsen over time, affecting daily life, relationships, and overall quality of life [1]. Early diagnosis is crucial, but it requires a thoughtful, multi-layered approach to truly understand and support these individuals [2]. In Bangladesh, the social and structural environment is not yet responsive or inclusive enough to address these challenges, leaving many to suffer in silence [3]. Despite the urgent need for action, there is a lack of studies in South Asia that use innovative, scalable methods to understand the mental health of people with disabilities. In addition to physical barriers, persons with disabilities (PWDs) encounter significant societal challenges, including a prevailing culture that offers limited access to conventional employment. Despite the availability of workplace accommodations, many capable and willing PWDs still face restricted opportunities to participate in the workforce [24]. Mental health among PWDs remains an under-researched area, particularly in low- and middle-income countries (LMICs) like Bangladesh, where access to mental health services is limited and stigma remains pervasive [8]. Although mental health awareness has improved in Bangladesh in recent years, large-scale, data-driven studies focusing specifically on the psychological well-being of individuals with disabilities are notably scarce. Moreover, most national surveys and public health initiatives fail to disaggregate mental health data by disability status, resulting in limited visibility and support for this vulnerable group in both research and policy contexts [9]. While individuals with disabilities might feel hesitant to express their emotional distress in face-to-face interactions, they often turn to social media as a safer space for self-expression [4]. Important insights into their mental health can be gained through their online behavior, how they use language, their emotional tone, and how much they engage. Natural language processing (NLP) now offers a unique opportunity to analyze these online markers and detect signs of mental distress, such as depression or anxiety [5]. Different age groups experience depression and stress in distinct ways [14], and they handle these challenges differently. Gender also offers a massive reason for depression expressions [22] because males are found to have more precise forms of depression than females [23]. Furthermore, different situations tend to confront them; thus, the ways these issues are handled are also greatly diverse. For many people with disabilities, especially in resource-limited settings, formal mental health assessments are often inaccessible [6]. However, by analyzing their online traces [7], we can develop a cost-effective and scalable method to identify mental health risks. In this approach, the Patient Health Questionnaire-9 (PHQ-9) will be used as a psychometric scale to provide a validated measure of depression severity. The inclusion of the PHQ-9 will enhance the reliability of the digital mental health assessments, offering a robust validation for the data gathered from social media behavior. This combination improves the accuracy of the assessments and ensures that timely, evidence-based interventions can be implemented to make a meaningful impact on an individual's mental health. This study explores the mental health of individuals with disabilities in Bangladesh by analyzing their social media behavior [26] and qualitative interviews. These analyses are crucial as they offer a multifaceted understanding of mental health, particularly in individuals with disabilities, by combining clinical assessment tools with real-world social media data and thematic analysis of qualitative data. The PHQ-9 helps measure the severity of depression symptoms, providing clear insights into mental health. Emotional analysis, through sentiment analysis, uncovers underlying emotions like sadness or frustration in participants' responses. Linguistic analysis examines how word choices, such as pronouns and negations, reflect self-focus or emotional distance. NLP techniques, like zero-shot and few-shot learning, detect subtle emotional cues from text, even without explicit labels. While we conducted a qualitative interview to deep dive into understanding the problem. We collected direct data from the PWD participants, disability stigma in Bangladesh, and a very hard-to-reach community in this region. As a result, with limited quantitative data, we explored qualitative interviews to enrich the data and better understand the mental health of individuals with disabilities. Together, these methods create a richer understanding of mental health, merging clinical data with real-world emotional experiences. By analyzing language use, posting habits, and emotional tone, we combine computational analysis with psychometric tools to develop accessible and inclusive mental health surveillance methods for marginalized communities. To address these gaps, this study employs a two-phase mixed-methods design, integrating NLP-based computational analysis of social media language and behavior with standardized clinical assessment using the PHQ-9. Phase 1 draws on linguistic and sentiment patterns extracted from social media data to explore how people with disabilities express depression across gender and age groups. Phase 2 extends these insights through a structured survey, capturing symptom severity and behavioral patterns across a larger sample. Together, the two phases offer a layered understanding of depression that neither clinical tools nor computational methods could provide alone. Our goal is to contribute to a better understanding of mental health among people with disabilities, not just in Bangladesh, but across the Global South. OBJECTIVE The objective of this study is to understand how persons with disabilities (PWDs) in Bangladesh express and experience depression across gender and age groups, using social media behavior, linguistic analysis, and standardized clinical assessment as complementary lenses. The study aims to identify patterns in social media engagement, including usage frequency and emotional expression, and examine how these patterns relate to varying levels of mental distress [26]. In addition, the research will explore linguistic behaviors in the discussion with participants through the use of NLP techniques and sentiment analysis to characterize emotional and psychological states. The research hopes to find out how online behavior can reflect and influence the mental well-being of PWDs. METHODS This study employed a cross-sectional, non-probability design conducted across two phases of data collection. The first phase took place between October 30, 2024, and January 22, 2025, and the second phase extended from February 1 to June 14, 2025, yielding a combined sample of N=101 participants. Given the differing data modalities across the two phases, each cohort is described separately below, followed by an integrated overview of participant characteristics. Phase 1: Initial Cohort (N=20) —- Behavioral and Linguistic Analysis The first phase recruited 20 individuals with physical disabilities through purposive sampling [27], with assistance from key informants affiliated with disability support organizations across three major divisions of Bangladesh: Dhaka, Rajshahi, and Khulna. This phase adopted two complementary analytical approaches: (1) behavioral analysis of participants' social media usage patterns, incorporating PHQ-9 scores to examine associations with online activity; and (2) linguistic analysis employing natural language processing (NLP) techniques integrated with primary clinical measures to identify language-based indicators of depression, blending technical assessments with qualitative clinical insight. Data were collected through face-to-face semi-structured interviews conducted in the format of focus group discussions (FGDs) at participants' own locations. FGDs were prioritized as the primary qualitative method due to their capacity to encourage open dialogue and facilitate the authentic sharing of lived experiences. A total of five FGDs were conducted, with group sizes of 2, 7, 5, 4, and 4 participants respectively, supplemented by two individual interviews. All sessions were audio-recorded, transcribed in Bengali, and subsequently translated into English for analysis. In parallel, participants completed a structured online survey administered via a designated website linked to a Google Form, following established guidelines for transparent reporting of web-based surveys. This dual-method approach enabled triangulation of behavioral, linguistic, and self-reported clinical data. Eligible participants were required to be Bengali-speaking ad",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2196/preprints.105485.",
    },
  },
  {
    id: '2026-building-bridges-participatory-framework-ai',
    title: 'Building Bridges: A Participatory Framework for AI Accountability in South Asia',
    authors: [
      { customAuthor: { name: 'Farzana Islam' } },
      { customAuthor: { name: 'Tasmiah Tahsin Mayeesha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2026,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3772363.3799093',
    externalUrl: 'https://doi.org/10.1145/3772363.3799093',
    isOpenAccess: true,
    abstract:
      'AI accountability involves mandated government guidelines to develop and deploy AI while minimizing societal harm. This study examines how AI accountability can work in South Asia and proposes a framework for the AI product lifecycle. Through 36 semi-structured interviews with developers, policymakers, and community leaders, we present an adaptable framework with four components: empowerment, system deployment, governance, and an investigating body. This framework addresses regional challenges like low AI literacy and weak governance structures. Unlike existing global frameworks that assume stable institutions, our approach operationalizes principles through participatory methods tailored for resource-constrained contexts.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3772363.3799093.",
    },
  },
  {
    id: '2026-designing-amplifying-voices-supporting-bangladeshs',
    title:
      'Designing for Amplifying Voices: Supporting Bangladesh’s Low-Income RMG Workers Through Technology Amid COVID-19 Pandemic: Qualitative Study',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2026,
    status: 'published',
    type: 'journal',
    venueLabel: 'JMIR Human Factors',
    doi: '10.2196/90675',
    externalUrl: 'https://doi.org/10.2196/90675',
    isOpenAccess: true,
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2196/90675.",
    },
  },
  {
    id: '2026-dual-source-retrieval-augmented-generation',
    title:
      'Dual-Source Retrieval-Augmented Generation Chatbot for Women’s Health (HerCare): Design and Multimethod Evaluation Study',
    authors: [
      { customAuthor: { name: 'Kimia Tuz Zaman' } },
      { customAuthor: { name: 'Wordh Ul Hasan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Juan Li' } },
    ],
    year: 2026,
    status: 'published',
    type: 'journal',
    venue: 'jmir-form-res',
    doi: '10.2196/88549',
    externalUrl: 'https://doi.org/10.2196/88549',
    isOpenAccess: true,
    abstract:
      "Background: Conversational agents for women's health often fail to meet user needs, offering either clinically sterile advice or unreliable peer anecdotes. This limitation creates a tension between the need for factual safety and emotional resonance in sensitive health contexts. Objective: We aimed to address this gap by developing and conducting a formative evaluation of HerCare, a conversational agent built on a novel dual-source retrieval-augmented generation architecture. The system integrates expert medical knowledge with peer narratives and makes the provenance of each response visible to users, enabling trust calibration through transparent source attribution. Methods: We conducted a remote, web-based single-session field study (December 2024 to January 2025; North Dakota State University Institutional Review Board Protocol #IRB0005368) with 243 completers (from 335 eligible, consenting visitors) recruited via social media (Facebook [Meta], Reddit, and Instagram [Meta]) and university mailing lists. Eligible participants self-identified as women aged 18-45 years with English proficiency and internet access. We used a quantitative multimethod evaluation, combining standardized self-report metrics-the Chatbot Usability Questionnaire and net promoter score (NPS)-with computational linguistic analyses (VADER [Valence Aware Dictionary and Sentiment Reasoner] sentiment analysis and NRC [National Research Council] Emotion Lexicon) of 1191 conversational turns. Results: Among the 243 participants who completed the protocol, reported usability was high (Chatbot Usability Questionnaire median 78.1, IQR 65.2-87.5; mean 75.67, SD 15.50) and advocacy was strong (NPS 60.0; 171/243, 70.4% promoters, 25/243, 10.3% detractors), though this NPS reflects completers only. Postinteraction ratings were high (all facets median 4-5 on a 5-point scale; helpfulness, ease of use, and clarity median 5, IQR 4-5). Computational analysis revealed a consistent polarity shift from neutral to negative user queries (compound -0.18 to +0.15) to strongly positive agent responses (compound +0.55 to +0.83), with a recurring validate-then-redirect empathy pattern in which the agent acknowledges user distress before pivoting to constructive guidance. Conclusions: Among completers, the dual-source architecture was associated with high perceived empathy and trust, suggesting it can combine clinical accuracy with emotional support. These formative findings indicate the feasibility of weaving clinical sources with lived experiences toward safer, more resonant health AI and surface a candidate design pattern for future empathy-attuned systems that warrants controlled evaluation.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2196/88549.",
    },
  },
  {
    id: '2026-meena-needs-computer-now-co',
    title:
      'Meena Needs a Computer Now: Co-design Solutions to Barriers Using Fictional Inquiry for Women in Computing',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Tasmiah Tahsin Mayeesha' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Sumit Kumar Kar' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Sumaya Akter Ruhi' } },
      { customAuthor: { name: 'Md. Hussain Shahriar' } },
      { customAuthor: { name: 'Sumaya Yasmin' } },
      { customAuthor: { name: 'Nazmun Nahar' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
    ],
    year: 2026,
    status: 'published',
    type: 'journal',
    venue: 'tochi',
    doi: '10.1145/3762808',
    externalUrl: 'https://doi.org/10.1145/3762808',
    isOpenAccess: true,
    featured: true,
    citationText:
      'Nova Ahmed, Tasmiah Tahsin, Ifti Azad Abeer, Sumit Kumar Kar, Anik Saha, Anik Sinha, Sumaya Akter Ruhi, Md. Hussain Shahriar, Sumaya Yasmin, Nazmun Nahar, and Syeda Shabnam. "Meena Needs a Computer Now: Co-design Solutions to Barriers using Fictional Inquiry for Women in Computing." ACM Transactions on Computer-Human Interaction, Just Accepted (August 2025). https://doi.org/10.1145/3762808',
    abstract:
      'Gender disparity in computing is a well-explored concern. To complement existing research, we use a non-intrusive exploration method of Fictional Inquiry. Followed by co-design workshop to explore solution approaches to increase women’s participation in computing. The study involved n = 48 Women in Computing (WiC) students in computing from four universities across Bangladesh. Participants shared their challenges and desired solutions which we analyzed using qualitative methods along with Natural Language Processing based tools to illustrate the problems from various perspectives while minimizing potential biases. The research team reflects on methodological decisions, policy implications, and the need for culturally and contextually appropriate tools and datasets to better support WiC research in resource-limited settings.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 110); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3762808.',
    },
  },
  {
    id: '2026-peer-support-online-womens-health',
    title:
      'Peer Support in Online Women’s Health Communities: Mixed Methods Formative Analysis of Reddit Discourse',
    authors: [
      { customAuthor: { name: 'Kimia Tuz Zaman' } },
      { customAuthor: { name: 'Wordh Ul Hasan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Juan Li' } },
    ],
    year: 2026,
    status: 'published',
    type: 'journal',
    venue: 'jmir-form-res',
    doi: '10.2196/87782',
    externalUrl: 'https://doi.org/10.2196/87782',
    isOpenAccess: true,
    abstract:
      'Background: Stigmatized women\'s health issues, such as polycystic ovary syndrome (PCOS) and endometriosis, are often marginalized or dismissed in traditional clinical settings. This drives individuals to seek peer support in anonymous online communities such as Reddit. While these digital platforms host critical discussions, they are often designed as static information repositories, failing to account for the complex emotional, temporal, and cultural dynamics that shape users\' support needs. There is a disconnect between the lived experiences of users-particularly feelings of clinical dismissal and the need for culturally specific advice-and the design of the sociotechnical systems they rely on. Objective: This study aimed to deconstruct support practices in online women\'s health forums to provide a formative basis for designing more responsive digital health systems. We analyzed the intersections of discussion topics, emotional expression, temporal shifts (specifically the impact of the COVID-19 pandemic), and culturally situated discourse to identify unmet user needs and effective peer-support patterns. Methods: We conducted a large-scale, mixed-methods analysis of 4995 posts and 460,317 comments from 5 major women\'s health subreddits (r/WomensHealth, r/TwoXChromosomes, r/BirthControl, r/Endometriosis, and r/PCOS). Computational methods included Latent Dirichlet Allocation for topic modeling, Valence Aware Dictionary for Sentiment Reasoning for sentiment analysis, and the NRC Emotion Lexicon for granular emotion classification. We segmented the data into pre-, during-, and post-COVID-19 periods to analyze temporal shifts. This quantitative analysis was complemented by a 2-phase qualitative thematic analysis to identify and characterize engagement patterns within 147 validated culturally situated threads. Results: Our analysis revealed that the most prevalent and emotionally negative topic was "Pain & Doctor Visits," which was uniquely characterized by high levels of fear and sadness linked to systemic clinical dismissal. The COVID-19 pandemic triggered a significant topical "turn inward," with discussions shifting away from social or political issues and toward somatic concerns (eg, "PCOS" "Pain & Doctor Visits"). Paradoxically, this period saw a simultaneous rise in both negative emotions (eg, fear and sadness) and expressions of community trust. Critically, our qualitative analysis of culturally situated discourse uncovered a consistent three-stage "playbook" for effective support: (1) Affirmation to establish psychological safety and validate cultural experiences; (2) Information Scaffolding to provide actionable, culturally tailored advice; and (3) Intercultural Bridging to facilitate community-wide learning and empathy. Conclusions: Online health forums operate as essential, resilient sociotechnical infrastructures that actively compensate for failures and gaps in formal health care. The "Affirmation-Scaffolding-Bridging" model identified in our research provides a clear, formative framework for designing future digital health interventions. These findings can guide the development of new platforms that are emotionally aware, culturally responsive, and adaptive to user needs and external crises.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2196/87782.",
    },
  },
  {
    id: '2026-shurokkha-helmet-minimalistic-pragmatic-approach',
    title:
      'Shurokkha Helmet: A Minimalistic and Pragmatic Approach to Ensure Safety on Bangladeshi Construction Sites for Marginal Community',
    authors: [
      { customAuthor: { name: 'Mostakim Hossain' } },
      { customAuthor: { name: 'Safat Mamun' } },
      { customAuthor: { name: 'Md. Musfiq Hossain' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Md. Musfiq Hossain' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2026,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'SSRN Electronic Journal',
    doi: '10.2139/ssrn.6429402',
    externalUrl: 'https://doi.org/10.2139/ssrn.6429402',
    isOpenAccess: true,
    abstract:
      "Worker safety on construction sites demands effective technological solutions. This paper proposes a pragmatic smart helmet for Bangladeshi construction sites, equipped with sensors for temperature, humidity, gas, and fall detection that transmit data in real-time to a centralized server. This IoT approach enables safety managers to oversee worker conditions and receive automated alerts. Qualitative analysis based on interviews with workers, supervisors, and management reveals that primary barriers to adoption are human-centric rather than technical. The helmet's success depends on durability, ease of use, and low cost. This study concludes that a pragmatic, server-monitored smart helmet is viable, provided the physical design is co-developed with workers to withstand harsh construction environments.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2139/ssrn.6429402.",
    },
  },
  {
    id: '2026-spondon-low-cost-multi-sensor',
    title:
      'Spondon: A Low-Cost, Multi-Sensor Wearable for Understanding Stress in Resource-Constrained Countries',
    authors: [
      { customAuthor: { name: 'Shahariar Ifti' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Shuvashish Chakraborty' } },
      { customAuthor: { name: 'Asif Mahbub' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2026,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    doi: '10.1145/3811242.3819996',
    externalUrl: 'https://doi.org/10.1145/3811242.3819996',
    isOpenAccess: true,
    abstract:
      'Stress remains a significant health concern, yet commercial monitoring devices are often too expensive and complex for populations in developing countries. This research presents Spondon, a low-cost, multi-sensor wearable designed to detect stress in resource-constrained environments. Utilizing an ESP32 microcontroller with MAX30102, GSR, and temperature sensors, the device collects physiological data. We evaluated the system with 15 participants using the Stroop test to induce stress across baseline, task, and recovery phases. Statistical analysis confirmed a distinct 7.95% drop in HRV (RMSSD) during stress. The system achieved a 75.0% accuracy in binary acute stress detection (Baseline vs. Stress) using a Random Forest classifier with personalized baseline normalization. In addition, when evaluating continuous real-world monitoring across three physiological states (Baseline, Stress, and Recovery), Spondon achieved a 58.4% multi-class accuracy, successfully outperforming the 33.3% random-chance baseline. This work contributes a validated, accessible hardware platform and methodology, democratizing stress research for low-income communities and highlighting the importance of personalized, context-aware design in HCI.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3811242.3819996.",
    },
  },
  {
    id: '2025-we-just-one-step-away',
    title:
      '"We Are Just One Step Away"; Embracing \'4IR\' With Realistic Transitional Framework Rooted With the Manufacturing Practices of RMG Industries in Bangladesh',
    authors: [
      { customAuthor: { name: 'Antara Saha' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2025,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3706599.3720235',
    externalUrl: 'https://doi.org/10.1145/3706599.3720235',
    isOpenAccess: false,
    citationText:
      'Saha, Antara, Ifti Azad Abeer, and Nova Ahmed. "" We Are Just One Step Away"; Embracing\'4IR\'With Realistic Transitional Framework Rooted With the Manufacturing Practices of RMG Industries in Bangladesh." In Proceedings of the Extended Abstracts of the CHI Conference on Human Factors in Computing Systems, pp. 1-12. 2025.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 100); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3706599.3720235.",
    },
  },
  {
    id: '2025-design-exploration-address-breast-cancer',
    title:
      'A Design Exploration to Address Breast Cancer A qualitative study considering the context of Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Khurshida Akhter' } },
      { customAuthor: { name: 'Shaheda Islam' } },
      { customAuthor: { name: 'Sohag Faruque' } },
      { customAuthor: { name: 'Anik Saha' } },
    ],
    year: 2025,
    status: 'published',
    type: 'conference',
    venueLabel:
      'Proceedings of the 16th International Conference of Human-Computer Interaction (HCI) Design & Research',
    doi: '10.1145/3768633.3770128',
    externalUrl: 'https://doi.org/10.1145/3768633.3770128',
    isOpenAccess: true,
    abstract:
      'Breast cancer, a major cancer for women in Bangladesh is considered in terms of technology design in this work. To understand the design requirements, we have conducted a qualitative study on 12 groups consisting of 147 participants (107 female, 40 male) with a diverse age range, economic condition, and location. The study showed a clear lack of engagement considering the awareness and actions to take around the problem of breast cancer. It showed structural, social, and religious barriers women face to access information and resources; the work showed a lack of agency of women for financial barriers and social norms, and finally, the desire to seek changes. These findings were aligned to Naila Kabeer’s empowerment framework that shows access to resources, agency to make decisions are needed towards empowerment. The research provides a design guideline and a discussion around future directions.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3768633.3770128.",
    },
  },
  {
    id: '2025-breast-cancer-womens-image-social',
    title: "Breast Cancer & Women's Image through Social Lenses Context of Bangladesh",
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Khurshida Akhter' } },
      { customAuthor: { name: 'Shaheda Islam' } },
      { customAuthor: { name: 'Sohag Faruque' } },
    ],
    year: 2025,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    doi: '10.1145/3715335.3736313',
    externalUrl: 'https://doi.org/10.1145/3715335.3736313',
    isOpenAccess: false,
    abstract:
      'Breast cancer, a major cancer for women in Bangladesh is considered in this work. Women require social approval prior to make active decision to act on investigation process and treatment process of breast cancer. We have conducted qualitative study on 12 groups consisting of 147 participants (107 female) with diverse age range, economic condition and location. Our initial effort to discuss about breast cancer faced barriers based on religion and social constraints. We look at the problem through feminist framing that would allow acceptable design considering ongoing barriers.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3715335.3736313.",
    },
  },
  {
    id: '2025-bridging-gaps-hci-advancing-education',
    title: 'Bridging Gaps in HCI: Advancing Education, Research, and Careers in Asia',
    authors: [
      { customAuthor: { name: 'Dilrukshi Gamage' } },
      { customAuthor: { name: 'Shiwei Cheng' } },
      { customAuthor: { name: 'Preeti Mudliar' } },
      { customAuthor: { name: 'Zhicong Lu' } },
      { customAuthor: { name: 'Shengdong Zhao' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Xiaojuan Ma' } },
      { customAuthor: { name: 'Uichin Lee' } },
      { customAuthor: { name: 'Ding Wang' } },
    ],
    year: 2025,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3706599.3716298',
    externalUrl: 'https://doi.org/10.1145/3706599.3716298',
    isOpenAccess: false,
    abstract:
      'Asia’s Human-Computer Interaction (HCI) landscape is rapidly evolving, yet it faces distinct challenges in curriculum development, research establishment, and career navigation. This panel discussion, hosted by Asia SIGCHI Committee (ASC) at CHI2025, will bring together distinguished experts to address these challenges and explore strategies for fostering a robust and inclusive HCI community in Asia. Panelists will discuss the integration of culturally relevant content in HCI education, approaches to enhancing research visibility on international platforms, and initiatives to bridge gaps between academic training and industry expectations. Through an engaging discussion and audience interaction, the panel aims to identify actionable solutions, promote collaboration, and inspire future initiatives that strengthen HCI’s growth across the region. Participants will gain valuable insights into overcoming systemic barriers while building sustainable and impactful HCI programs tailored to Asia’s unique sociocultural dynamics. This panel seeks to advance the global relevance and contributions of HCI in Asia.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3706599.3716298.",
    },
  },
  {
    id: '2025-implications-mobile-financial-service-users',
    title:
      'Implications of Mobile Financial Service Users’ Adaptive Usage Behavior: The Vicious Cycle of Negative Experience, Social Construct, and Confidence',
    authors: [
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Gazi Fakhrul Islam' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Md. Sabbir Ahmed' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2025,
    status: 'published',
    type: 'journal',
    venue: 'acm-jcss',
    doi: '10.1145/3723041',
    externalUrl: 'https://doi.org/10.1145/3723041',
    isOpenAccess: true,
    citationText:
      "Ifti Azad Abeer, Anik Saha, Anik Sinha, Rahat Jahangir Rony, Gazi Fakhrul Islam, Shajnush Amir, Md. Sabbir Ahmed, Syeda Shabnam Khan, and Nova Ahmed. 2025. Implications of Mobile Financial Service Users' Adaptive Usage Behavior: The Vicious Cycle of Negative Experience, Social Construct, and Confidence. ACM Journal on Computing and Sustainable Societies (March 2025). https://doi.org/10.1145/3723041",
    abstract:
      'The COVID-19 pandemic increased the usage of Mobile Financial Services (MFSs) everywhere, including in developing countries such as Bangladesh. The increment of usage is paired with continuing misuse and abuse in several ways that impact users’ MFS usage behaviors. This qualitative study aimed to understand users’ adoptive MFS usage behaviors due to negative experiences and their implications among several communities. The study took place across all eight divisions in Bangladesh and did focus group discussions involving N = 313 participants (female = 203, male = 108, and transgender = 2) covering urban, suburban, and rural regions. Study findings present the ways participants limit their usage, delegate MFS operations, and rely on others to avoid misuse and abuse. The stories also indicate the inability of these measures to avoid monetary loss, which creates more negativity. We discuss the cyclic relationship between negative experiences, social constructs, and confidence. We suggest potential technology interventions to break the cycle.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 104); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3723041.',
    },
  },
  {
    id: '2025-jalli-system-level-support-critical',
    title: 'Jalli: System Level Support for Critical Real-Time Applications',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Md. Majedur Rahman' } },
    ],
    year: 2025,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    doi: '10.1145/3715335.3744891',
    externalUrl: 'https://doi.org/10.1145/3715335.3744891',
    isOpenAccess: false,
    citationText:
      'N. Ahmed, R.J. Rony, and M. M. Rahman, “Jalli: System level support for critical real-time applications”, in Proceedings of the ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies, ser. COMPASS ’25, Association for Computing Machinery, 2025, pp. 681–683, isbn: 9798400714849. doi: 10.1145/3715335.3744891.',
    abstract:
      'System level support is required for modern day Internet of Things (IoT) based applications. It opens up opportunities for low-cost solution approaches. We have developed a system solution for real time IoT based applications that allows real time access to location information and allows level of data abstraction for tracing location to be used in emergency situations. We have developed a wearable IoT solution to deal with the problem of sexual harassment on top of the system named Jalli. The application considers a developing country context. We hope that a system that is aware and sensitive about the resource limitations can bring out best possible system performance in the context of low resource regions.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 108); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3715335.3744891.',
    },
  },
  {
    id: '2025-joyee-pcos-chatbot',
    title: 'Joyee — A PCOS Chatbot',
    authors: [
      { customAuthor: { name: 'Rubyda Hossain' } },
      { customAuthor: { name: 'Rifah Nanjiba Khan' } },
      { customAuthor: { name: 'Partha Sarathi Roy Chowdhury' } },
      { customAuthor: { name: 'Syeda Madeha Mowla Manarat Huda' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2025,
    status: 'published',
    type: 'book-chapter',
    venueLabel: 'Lecture Notes in Computer Science',
    doi: '10.1007/978-3-031-93236-6_13',
    externalUrl: 'https://doi.org/10.1007/978-3-031-93236-6_13',
    isOpenAccess: false,
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1007/978-3-031-93236-6_13.",
    },
  },
  {
    id: '2025-teens-online-behavior-support-interventions',
    title: 'Teens Online Behavior and Support Interventions in Bangladesh',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2025,
    status: 'published',
    type: 'journal',
    venue: 'acm-jcss',
    doi: '10.1145/3704813',
    externalUrl: 'https://doi.org/10.1145/3704813',
    isOpenAccess: true,
    citationText:
      'Rony, Rahat Jahangir, and Nova Ahmed. "Teens online behavior and support interventions in Bangladesh." ACM Journal on Computing and Sustainable Societies 3.1 (2025): 1-22.',
    abstract:
      'Teens are vulnerable online, and their risk behaviors and possible support for safe online space are studied in the Western context but unexplored in developing countries. Considering the cultural context and research gaps, we interviewed n = 28 teens in urban Bangladesh to investigate their unique online activities, experiences, and strategies for protecting online accounts and knowledge. They are involved in several risk-taking behaviors, including communicating with strangers without being aware of possible vulnerabilities, uncovering their lack of online safety knowledge, and being unaware of online journeys from the beginning. These teens have negative online experiences; some coping techniques, such as hiding information, changing profile settings, and unfollowing the unknowns, help them without seeking additional support. We propose design interventions regarding knowledge and awareness increment, implementing co-learning and policy, which will help teens become aware and knowledgeable at the beginning of their online usage, reducing their negative experiences in the future.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 102); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3704813.",
    },
  },
  {
    id: '2025-necessary-ingredients-success-women-computing',
    title:
      'The Necessary Ingredients for Success of Women in Computing: A 360° Perspective from Students, Professionals and Stakeholders',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Tasmiah Tahsin Mayeesha' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Anik Saha' } },
    ],
    year: 2025,
    status: 'published',
    type: 'journal',
    venue: 'acm-jcss',
    doi: '10.1145/3724502',
    externalUrl: 'https://doi.org/10.1145/3724502',
    isOpenAccess: true,
    citationText:
      'Nova Ahmed, Tasmiah Tahsin Mayeesha, Ifti Azad Abeer, Anik Sinha, and Anik Saha. 2025. The Necessary Ingredients for Success of Women in Computing: A 360° Perspective from Students, Professionals and Stakeholders. ACM J. Comput. Sustain. Soc. Just Accepted (March 2025). https://doi.org/10.1145/3724502',
    abstract:
      'The underrepresentation of women in computing in the workplace requires an understanding of the adequate elements needed for women to succeed in Bangladesh complementing the existing body of work. It uses a varied modality of communication Fictional inquiry (FI), where participants write letters to fictional characters followed by a Co-design of solutions. This research considers N=71 participants, 48 tertiary-level computer science and engineering students, and 23 stakeholders covering academics, computing professionals, and guardians of women in computing over a period of one and a half years. The study identifies three major elements for women in computing to succeed professionally: provision to improve skills and self-efficacy, ensuring ways to increase the sense of belonging, and providing transportation and safety aligning through the women’s empowerment framework of Naila Kabeer. The required elements for success and empowerment show that a collaborative approach of support is required from families, institutes, and authorities from a regional perspective that can be of interest to researchers from the HCI, CSCW, and ICTD fields. This work is further expected to provide a guideline for stakeholders, policymakers, institutions, and families eager to ensure inclusive learning and growing space for women in computing.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 106); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3724502.',
    },
  },
  {
    id: '2025-understanding-mental-physical-burdens-physicians',
    title:
      'Understanding the Mental and Physical Burdens of Physicians and Identifying Support Interventions in Bangladesh: Qualitative Study',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Shams Akbar Aalok' } },
      { customAuthor: { name: 'Lamia Amin Tisha' } },
      { customAuthor: { name: 'Marzan Mahatab' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2025,
    status: 'published',
    type: 'journal',
    venueLabel: 'Interactive Journal of Medical Research',
    doi: '10.2196/76934',
    externalUrl: 'https://doi.org/10.2196/76934',
    isOpenAccess: true,
    citationText:
      'Rony RJ, Aalok SA, Tisha LA, Mahatab M, Ahmed N. "Behind the White Coat: Understanding the Mental and Physical Burdens of Doctors and Support Interventions in Bangladesh: A Qualitative Study. Interactive Journal of Medical Research. JMIR. DOI: 10.2196/76934',
    abstract:
      "BACKGROUND: The COVID-19 pandemic had a substantial, negative impact on the world, and physicians played a crucial role in providing health care while facing the risk of contracting the virus themselves. While working on the frontlines, they also needed to protect themselves and their families from the virus. Unfortunately, their mental health was not given the attention it deserved. Many physicians experienced burnout due to the numerous challenges they faced, yet they received little support. Resource-limited countries such as Bangladesh were particularly affected due to a lack of resources. Although high-income countries have proposed a well-being model for physicians, this model is not directly applicable to resource-limited nations. However, redefining the model to suit the specific needs of physicians in resource-limited countries could provide sustainable support for their well-being. OBJECTIVE: We aimed to gain a deeper understanding of the mental and physical burdens faced by Bangladeshi physicians during the COVID-19 pandemic, and the contextual factors influencing their well-being. By understanding these aspects, we can recommend an adaptable, effective, and sustainable contextual model. METHODS: We conducted semistructured online interviews with 14 physicians in Chattogram, Bangladesh, during the COVID-19 pandemic. The physicians actively working in the COVID-19 unit were recruited from public and private hospitals through purposive sampling. Participants were aged between 25 and 35 years and had up to 8 years of working experience, including 43% (6/14) interns, 36% (5/14) medical officers, 14% (2/14) researchers, and 7% (1/14) surgeons. Each interview was conducted in Bengali, and we obtained consent to record the audio. Overall, 637 minutes of discussion were translated and transcribed. The results were analyzed using reflexive thematic analysis. RESULTS: We identified factors that impacted physicians' mental and physical health and well-being during the COVID-19 pandemic. They frequently dealt with undiagnosed patients, which put them at risk. Physicians often feared the potential danger their profession posed to their families, choosing to prioritize their family's safety over their own. In addition, heavy workloads, excessive duty hours, and a shortage of colleagues substantially affected their sleep patterns and disrupted their regular work schedules. Instead of receiving societal support, they often faced negative perceptions from the public. In addition, during times of mass patient deaths, many physicians struggled to cope with their emotions without any mental health support. CONCLUSIONS: Our work shows physicians' mental and physical health burdens with various contextual difficulties. We understood these concerns and suggested a contextual (emphasizes understanding and addressing users' behavior within its specific context) intervention model inspired by the well-being framework. We emphasize the importance of integrating both contextual and technological interventions. Through this model, our goal is to involve stakeholders in redesigning the work environment for physicians, ensuring it is sustainable in the long term and adaptable to different situations.",
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 96); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.2196/76934.',
    },
  },
  {
    id: '2025-unveiling-engaging-humans-networking-research',
    title: 'Unveiling and Engaging with the Humans of Networking Research',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Laura Gazda' } },
      { customAuthor: { name: 'Eric Greenlee' } },
      { customAuthor: { name: 'Shelby Hagemann' } },
      { customAuthor: { name: 'Kurtis Heimerl' } },
      { customAuthor: { name: 'Esther Jang' } },
      { customAuthor: { name: 'Fernanda R. Rosa' } },
      { customAuthor: { name: 'Loqman Salamatian' } },
      { customAuthor: { name: 'Jason Young' } },
    ],
    year: 2025,
    status: 'published',
    type: 'conference',
    venueLabel: 'Proceedings of the 24th ACM Workshop on Hot Topics in Networks',
    doi: '10.1145/3772356.3772400',
    externalUrl: 'https://doi.org/10.1145/3772356.3772400',
    isOpenAccess: true,
    abstract:
      'Networking research often abstracts away the people who build, operate, and experience the Internet. Yet, human decisions shape what gets measured, which problems are prioritized, and how solutions are deployed. This paper argues that such human influence is foundational and deserves methodological attention. To do so, we discuss three well-known qualitative methods and approaches: participatory action research, ethnographic methods, and positionality as concrete ways of engaging with the social and operational realities that underlie technical systems. These approaches formalize processes that are commonly implicit in networking research, help surface questions that cannot be answered with traces alone, and make space for voices often left out of the research pipeline or are inadvertently concealed due to the lack of formal procedures to include them in our research methods. Ultimately, we argue for a broader understanding of legitimate, and sometimes informal, contributions to networking research—one that better reflects the human element of how the Internet is structured and is experienced.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3772356.3772400.",
    },
  },
  {
    id: '2024-if-men-andwomenworked-together-we',
    title:
      '"If Men andWomenWorked Together,We could Accelerate Growth": Opportunities in the Presence of Gender Stereotype for Robot Olympiad Participants from Bangladesh',
    authors: [
      { customAuthor: { name: 'Nasheetat Zainah Rahman' } },
      { customAuthor: { name: 'Ipshita Ahmed Moon' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'extended-abstract',
    venue: 'cscw',
    doi: '10.1145/3678884.3681896',
    externalUrl: 'https://doi.org/10.1145/3678884.3681896',
    isOpenAccess: true,
    abstract:
      "This work closely examines Bangladesh Robot Olympiad (BDRO) participants who are teens competing internationally, covering N=23, (F= 12, M=11).The study findings were aligned through the lenses of Naila Kabeer's empowerment framework, showing access to resources, agency, and achievement as the parameters.While the resource access challenges are applicable to all genders, the social barriers make it harder for women.The surrounding support system plays an important role in ensuring agency and achievement, as the study shows.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3678884.3681896.",
    },
  },
  {
    id: '2024-personalized-communication-application-children-autism',
    title:
      'A Personalized Communication Application for Children with Autism through a Participatory Design Approach',
    authors: [
      { customAuthor: { name: 'Md. Tamjid Hosain' } },
      { customAuthor: { name: 'Sami Uddin' } },
      { customAuthor: { name: 'Farhan Ahmed Fahim' } },
      { customAuthor: { name: 'Mayisha Muntaha Alam' } },
      { customAuthor: { name: 'Shams Akbar Aalok' } },
      { customAuthor: { name: 'Obayed Ur Rahman' } },
      { customAuthor: { name: 'Ashfaq Mahee Siddiky' } },
      { customAuthor: { name: 'Marzan Mahatab' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'extended-abstract',
    venue: 'cscw',
    doi: '10.1145/3678884.3681900',
    externalUrl: 'https://doi.org/10.1145/3678884.3681900',
    isOpenAccess: true,
    citationText:
      'Hosain, Md Tamjid, Sami Uddin, Farhan Ahmed Fahim, Mayisha Muntaha Alam, Shams Akbar Aalok, Obayed Ur Rahman, Ashfaq Mahee Siddiky, Marzan Mahatab, Anik Sinha, and Nova Ahmed. "A Personalized Communication Application for Children with Autism through a Participatory Design Approach." In Companion Publication of the 2024 Conference on Computer-Supported Cooperative Work and Social Computing, pp. 519-524. 2024.',
    abstract:
      'Developing regions lack personalizable mobile applications with cultural context for CWA to aid in communication with parents and teachers. This led us to design and develop an application to address this underexplored area. Three participants (parents and teachers of CWA participated in two participatory design sessions to develop and improve the application. The same participants shared their views on the design and features of the application in the first study and provided feedback about them in the second study. There exists a literature gap on cultural context-based applications and a lack of personalization features for CWA. Our study aims to provide meaningful communication between CWA and others by developing a communication application that can be customized and personalized to cater to their needs. This work provides contextual design factors to HCI researchers by prototyping and developing a communication platform for CWA.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 119); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3678884.3681900.",
    },
  },
  {
    id: '2024-platform-connectivity-synergy-between-parents',
    title:
      'A Platform for Connectivity and Synergy between Parents and Teachers of Children with Autism',
    authors: [
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'journal',
    venue: 'acm-jcss',
    doi: '10.1145/3696434',
    externalUrl: 'https://doi.org/10.1145/3696434',
    isOpenAccess: false,
    citationText:
      'Abeer, Ifti Azad, Anik Sinha, Anik Saha, Syeda Shabnam Khan, and Nova Ahmed. "A Platform for Connectivity and Synergy between Parents and Teachers of Children with Autism." ACM Journal on Computing and Sustainable Societies 2, no. 4 (2024): 1-30.',
    abstract:
      'Collaboration between parents and teachers of Children with Autism (CWA) is emphasized for effective education while the communication gap between both sides impedes it. The lack of specially designed tools to supplement the collaboration process in low-resource settings led us to initiate the research to design a platform for facilitating the synergy between both parties. This qualitative research was conducted in two phases where Phase I interviewed n=10 participants (parent=5, teacher=5). They emphasized personalized communication, maintaining privacy and accountability, and school authority’s role in ensuring meaningful communication ideating three design guidelines. The prototype was developed accordingly and evaluated in Phase II with n=18 (parent=8, teacher=10) participants. They shared different use cases of the application, suggested modifications, and recommended new features. The work presents the parents and teachers of CWA with a platform to connect and synchronize their efforts and provides the HCI researchers contextual design considerations while designing for resource-constrained communities in Global South.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 117); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3696434.",
    },
  },
  {
    id: '2024-addressing-technology-learning-divide-co',
    title:
      'Addressing the Technology Learning Divide Using Co-Learning with Familiarization Method',
    authors: [
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Naimur Rahman' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3613905.3650969',
    externalUrl: 'https://doi.org/10.1145/3613905.3650969',
    isOpenAccess: false,
    citationText:
      'Saha, Anik, Naimur Rahman, and Nova Ahmed. "Addressing the Technology Learning Divide Using Co-Learning with Familiarization Method." In Extended Abstracts of the CHI Conference on Human Factors in Computing Systems, pp. 1-8. 2024.',
    abstract:
      'Empowerment of low-literate women and marginalized communities through learning technology is emphasized by researchers. Co-learning techniques using familiarization methods can effectively help low-tech literate people learn technology, which is underexplored. This pilot study was conducted in two phases. Phase-I explored technology’s learning and adaptation strategies with a qualitative study, where the researcher considered N=36 female participants in urban and rural regions of 3 major divisions of Bangladesh. Phase-II was conducted N=16 (Parent=8, Children=8) participants in Dhaka division urban and rural settings with a series of workshops to understand the impact, opportunities, and challenges of co-learning and familiarization methods in terms of learning technology. Findings show that technology co-learning with familiarization methods greatly aids low-literate women in adopting and pursuing technology rapidly. The findings are essential to provide insights to the CHI, and CSCW community regarding opinions on technology learning and adaptation scenarios of low-tech literate women in developing countries perspectives.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 133); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3613905.3650969.",
    },
  },
  {
    id: '2024-ai4bangladesh-ai-ethics-bangladesh-challenges',
    title:
      'AI4Bangladesh: AI Ethics for Bangladesh - Challenges, Risks, Principles, and Suggestions',
    authors: [
      { customAuthor: { name: 'Tasmiah Tahsin Mayeesha' } },
      { customAuthor: { name: 'Farzana Islam' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/3700794.3700820',
    externalUrl: 'https://doi.org/10.1145/3700794.3700820',
    isOpenAccess: true,
    featured: true,
    citationText:
      "Tasmiah Tahsin Mayeesha, Farzana Islam, and Nova Ahmed. 2025. AI4Bangladesh: AI Ethics for Bangladesh - Challenges, Risks, Principles, and Suggestions. In Proceedings of the 13th International Conference on Information & Communication Technologies and Development (ICTD '24). Association for Computing Machinery, New York, NY, USA, 260–272. https://doi.org/10.1145/3700794.3700820",
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 98, also lines 115); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3700794.3700820.',
    },
  },
  {
    id: '2024-developing-communication-application-children-autism',
    title:
      'Developing a Communication Application for Children with Autism through a Participatory Design Approach',
    authors: [
      { customAuthor: { name: 'Mayisha Muntaha Alam' } },
      { customAuthor: { name: 'Shams Akbar Aalok' } },
      { customAuthor: { name: 'Farhan Ahmed Fahim' } },
      { customAuthor: { name: 'Sami Uddin' } },
      { customAuthor: { name: 'Obayed Ur Rahman' } },
      { customAuthor: { name: 'Marzan Mahatab' } },
      { customAuthor: { name: 'Ashfaq Mahee Siddiky' } },
      { customAuthor: { name: 'Md. Tamjid Hosain' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    citationText:
      'Mayisha Muntaha Alam, Shams Akbar Aalok, Farhan Ahmed Fahim, Sami Uddin, Obayed Ur Rahman, Marzan Mahatab, Ashfaq Mahee Siddiky, Md. Tamjid Hosain, Anik Sinha, and Nova Ahmed. Developing a Communication Application for Children with Autism through a Participatory Design Approach. In Proceedings of the ACM SIGCAS Conference on Computing and Sustainable Societies (COMPASS), 2024. https://2024.compass.acm.org/index.html%3Fp=10259.html',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 139); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2024-digital-financial-conditions-low-income',
    title:
      'Digital Financial Conditions for Low Income Communities of Dhaka City: Exploring Gender Based Differences',
    authors: [
      { customAuthor: { name: 'Anuva Chowdhury' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'SSRN Electronic Journal',
    doi: '10.2139/ssrn.4863970',
    externalUrl: 'https://doi.org/10.2139/ssrn.4863970',
    isOpenAccess: true,
    abstract:
      'The study explores current conditions of available to achieve digital financial services in the urban lower income communities in Bangladesh. The studies were conducted in Dhaka as part of a larger study to take place all across the country.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2139/ssrn.4863970.",
    },
  },
  {
    id: '2024-investigating-rhythmicity-app-usage-predict',
    title:
      'Investigating Rhythmicity in App Usage to Predict Depressive Symptoms: Protocol for Personalized Framework Development and Validation Through a Countrywide Study',
    authors: [
      { customAuthor: { name: 'Md Sabbir Ahmed' } },
      { customAuthor: { name: 'Tanvir Hasan' } },
      { customAuthor: { name: 'Salekul Islam' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'study-protocol',
    venue: 'jmir-res-protoc',
    doi: '10.2196/51540',
    externalUrl: 'https://doi.org/10.2196/51540',
    isOpenAccess: true,
    citationText:
      'Ahmed, Md Sabbir, Tanvir Hasan, Salekul Islam, and Nova Ahmed. "Investigating Rhythmicity in App Usage to Predict Depressive Symptoms: Protocol for Personalized Framework Development and Validation Through a Countrywide Study." JMIR Research Protocols 13, no. 1 (2024): e51540.',
    abstract:
      "BACKGROUND: Understanding a student's depressive symptoms could facilitate significantly more precise diagnosis and treatment. However, few studies have focused on depressive symptom prediction through unobtrusive systems, and these studies are limited by small sample sizes, low performance, and the requirement for higher resources. In addition, research has not explored whether statistically significant rhythms based on different app usage behavioral markers (eg, app usage sessions) exist that could be useful in finding subtle differences to predict with higher accuracy like the models based on rhythms of physiological data. OBJECTIVE: The main objective of this study is to explore whether there exist statistically significant rhythms in resource-insensitive app usage behavioral markers and predict depressive symptoms through these marker-based rhythmic features. Another objective of this study is to understand whether there is a potential link between rhythmic features and depressive symptoms. METHODS: Through a countrywide study, we collected 2952 students' raw app usage behavioral data and responses to the 9 depressive symptoms in the 9-item Patient Health Questionnaire (PHQ-9). The behavioral data were retrieved through our developed app, which was previously used in our pilot studies in Bangladesh on different research problems. To explore whether there is a rhythm based on app usage data, we will conduct a zero-amplitude test. In addition, we will develop a cosinor model for each participant to extract rhythmic parameters (eg, acrophase). In addition, to obtain a comprehensive picture of the rhythms, we will explore nonparametric rhythmic features (eg, interdaily stability). Furthermore, we will conduct regression analysis to understand the association of rhythmic features with depressive symptoms. Finally, we will develop a personalized multitask learning (MTL) framework to predict symptoms through rhythmic features. RESULTS: After applying inclusion criteria (eg, having app usage data of at least 2 days to explore rhythmicity), we kept the data of 2902 (98.31%) students for analysis, with 24.48 million app usage events, and 7 days' app usage of 2849 (98.17%) students. The students are from all 8 divisions of Bangladesh, both public and private universities (19 different universities and 52 different departments). We are analyzing the data and will publish the findings in a peer-reviewed publication. CONCLUSIONS: Having an in-depth understanding of app usage rhythms and their connection with depressive symptoms through a countrywide study can significantly help health care professionals and researchers better understand depressed students and may create possibilities for using app usage-based rhythms for intervention. In addition, the MTL framework based on app usage rhythmic features may more accurately predict depressive symptoms due to the rhythms' capability to find subtle differences. INTERNATIONAL REGISTERED REPORT IDENTIFIER (IRRID): DERR1-10.2196/51540.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 137); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.2196/51540.",
    },
  },
  {
    id: '2024-know-your-users-explainable-ai',
    title: 'Know Your Users: Towards Explainable AI in Bangladesh',
    authors: [
      { customAuthor: { name: 'Farzana Islam' } },
      { customAuthor: { name: 'Tasmiah Tahsin Mayeesha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'extended-abstract',
    venue: 'ubicomp',
    doi: '10.1145/3675094.3679002',
    externalUrl: 'https://doi.org/10.1145/3675094.3679002',
    isOpenAccess: false,
    citationText:
      'Islam, Farzana, Tasmiah Tahsin Mayeesha, and Nova Ahmed. "Know Your Users: Towards Explainable AI in Bangladesh." In Companion of the 2024 on ACM International Joint Conference on Pervasive and Ubiquitous Computing, pp. 890-893. 2024.',
    abstract:
      "When we are talking about explainable AI and trying to come out of the black box by going beyond algorithmic transparency, we are being ignorant about a big user community. Although XAI research has advanced over time, there hasn't been much study done on the development, evaluation, and application of explainability methodologies in the global south. In this paper, we focus on Bangladesh, which is a part of the South, to understand the AI user community of this region and show how the explainability needs are different for different users and who should XAI focus on. Our work reflects on the unique needs and constraints of the region and recommends potential directions for accessible and human-centered explainability research. We argue that before developing technology and systems, human requirements should be assessed and comprehended.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 123); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3675094.3679002.",
    },
  },
  {
    id: '2024-making-ethics-home-global-cs',
    title: 'Making Ethics at Home in Global CS Education: Provoking Stories from the Souths',
    authors: [
      { customAuthor: { name: 'Marisol Wong-Villacres' } },
      { customAuthor: { name: 'Cat Kutay' } },
      { customAuthor: { name: 'Shaimaa Lazem' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Cristina Abad' } },
      { customAuthor: { name: 'Cesar Collazos' } },
      { customAuthor: { name: 'Shady Elbassuoni' } },
      { customAuthor: { name: 'Farzana Islam' } },
      { customAuthor: { name: 'Deepa Singh' } },
      { customAuthor: { name: 'Tasmiah Tahsin Mayeesha' } },
      { customAuthor: { name: 'Martin Mabeifam Ujakpa' } },
      { customAuthor: { name: 'Tariq Zaman' } },
      { customAuthor: { name: 'Nicola J. Bidwell' } },
    ],
    year: 2024,
    status: 'published',
    type: 'journal',
    venue: 'acm-jcss',
    doi: '10.1145/3608113',
    externalUrl: 'https://doi.org/10.1145/3608113',
    isOpenAccess: true,
    abstract:
      "Despite the increase in university courses and curricula on the ethics of computing there are few studies about how computer science (CS) programs should account for the diverse ways ethical dilemmas and approaches to ethics are situated in cultural, philosophical, and governance systems, religions, and languages. We draw on the experiences and insights of 46 university educators and practitioners in Latin America, South-Asia, Africa, the Middle East, and Australian First Nations who participated in surveys and interviews. Our modest study seeks to prompt conversation about ethics and computing in the Global Souths and inform revisions to the Association of Computer Machinery's curricular guidelines for the Society, Ethics and Professionalism knowledge area in undergraduate CS programs. Participants describe frictions between static and anticipatory approaches to ethics in globalised regulations and formal codes of ethics and professional conduct and local practices, values, and impacts of technologies in the Global Souths. Codes and regulations are instruments for international control and their gap with local realities can cause harm, despite local efforts to compensate. However, our insights also illustrate opportunities for university teaching to link more closely to priorities, actions, and experiences in the Global Souths and enrich students’ education in the Global North.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3608113.",
    },
  },
  {
    id: '2024-nobody-can-see-us-overview',
    title: 'Nobody Can See Us: An Overview of Online Dating Site Experiences',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Abdul Wohab' } },
      { customAuthor: { name: 'Monisha Dey' } },
    ],
    year: 2024,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    doi: '10.1145/3674829.3675072',
    externalUrl: 'https://doi.org/10.1145/3674829.3675072',
    isOpenAccess: false,
    citationText:
      'Ahmed, Nova, Abdul Wohab, and Monisha Dey. "Nobody Can See Us: An Overview of Online Dating Site Experiences." In Proceedings of the 7th ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies, pp. 179-185. 2024.',
    abstract:
      "Although Bangladesh is a country that values matchmaking and matchmakers greatly, online dating is a relatively new phenomenon that became popular only recently mostly among the young population. While anecdotal reports suggest a considerable number of individuals utilize online dating platforms in Bangladesh, a comprehensive investigation of their experiences and the potential impact on their well-being has yet to be conducted. Given the growing prevalence of online dating apps among young adults in Bangladesh, the present study aims to conduct in-depth interviews with a sample of 33 participants between the ages of 18 and 25 who actively use these platforms. The sample comprises 14 male and 19 female participants, each of whom has experience using online dating apps. By gaining insights into the experiences of young adult users of dating apps in Bangladesh and examining the effects of such platforms on their physical and mental well-being, the findings of this study highlight three areas: a) youth's intention to fight existing social norms, b) gender experiences relating to abuse and harassment in online dating platforms, c) alternative usage of online dating application space, particularly during the Covid-19 pandemic period. This study also seeks to raise awareness of online usage patterns among young adults in Bangladesh and identify potential interventions that may address any negative outcomes associated with excessive online activity.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 125, also lines 141); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3674829.3675072.",
    },
  },
  {
    id: '2024-population-health',
    title: 'Population and Health',
    authors: [{ customAuthor: { name: 'Nova Ahmed' } }, { customAuthor: { name: 'Rajesh Balan' } }],
    year: 2024,
    status: 'published',
    type: 'journal',
    venueLabel: 'IEEE Pervasive Computing',
    doi: '10.1109/mprv.2024.3520397',
    externalUrl: 'https://doi.org/10.1109/mprv.2024.3520397',
    isOpenAccess: false,
    abstract:
      'This issue of IEEE Pervasive Magazine explores the potential for enhancing healthcare systems through the use of technology. The works presented focus on minimalism and privacy awareness, addressing the needs of often-overlooked communities, such as children with autism, people with disabilities, and infants, who require urgent attention to improve healthcare solutions.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1109/mprv.2024.3520397.",
    },
  },
  {
    id: '2024-predicting-transition-depression-suicidal-ideation',
    title:
      'Predicting the Transition From Depression to Suicidal Ideation Using Facebook Data Among Indian-Bangladeshi Individuals: Protocol for a Cohort Study',
    authors: [
      { customAuthor: { name: 'Manoshi Das Turjo' } },
      { customAuthor: { name: 'Khushboo Suchit Mundada' } },
      { customAuthor: { name: 'Nuzhat Jabeen Haque' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'study-protocol',
    venue: 'jmir-res-protoc',
    doi: '10.2196/55511',
    externalUrl: 'https://doi.org/10.2196/55511',
    isOpenAccess: true,
    citationText:
      'Turjo, Manoshi Das, Khushboo Suchit Mundada, Nuzhat Jabeen Haque, and Nova Ahmed. "Predicting the Transition From Depression to Suicidal Ideation Using Facebook Data Among Indian-Bangladeshi Individuals: Protocol for a Cohort Study." JMIR Research Protocols 13, no. 1 (2024): e55511.',
    abstract:
      "BACKGROUND: Suicide stands as a global public health concern with a pronounced impact, especially in low- and middle-income countries, where it remains largely unnoticed as a significant health concern, leading to delays in diagnosis and intervention. South Asia, in particular, has seen limited development in this area of research, and applying existing models from other regions is challenging due to cost constraints and the region's distinct linguistics and behavior. Social media analysis, notably on platforms such as Facebook (Meta Platforms Inc), offers the potential for detecting major depressive disorder and aiding individuals at risk of suicidal ideation. OBJECTIVE: This study primarily focuses on India and Bangladesh, both South Asian countries. It aims to construct a predictive model for suicidal ideation by incorporating unique, unexplored features along with masked content from both public and private Facebook profiles. Moreover, the research aims to fill the existing research gap by addressing the distinct challenges posed by South Asia's unique behavioral patterns, socioeconomic conditions, and linguistic nuances. Ultimately, this research strives to enhance suicide prevention efforts in the region by offering a cost-effective solution. METHODS: This quantitative research study will gather data through a web-based platform. Initially, participants will be asked a few demographic questions and to complete the 9-item Patient Health Questionnaire assessment. Eligible participants who provide consent will receive an email requesting them to upload a ZIP file of their Facebook data. The study will begin by determining whether Facebook is the primary application for the participants based on their active hours and Facebook use duration. Subsequently, the predictive model will incorporate a wide range of previously unexplored variables, including anonymous postings, and textual analysis features, such as captions, biographic information, group membership, preferred pages, interactions with advertisement content, and search history. The model will also analyze the use of emojis and the types of games participants engage with on Facebook. RESULTS: The study obtained approval from the scientific review committee on October 2, 2023, and subsequently received institutional review committee ethical clearance on December 8, 2023. Our system is anticipated to automatically detect posts related to depression by analyzing the text and use pattern of the individual with the best accuracy possible. Ultimately, our research aims to have practical utility in identifying individuals who may be at risk of depression or in need of mental health support. CONCLUSIONS: This initiative aims to enhance engagement in suicidal ideation medical care in South Asia to improve health outcomes. It is set to be the first study to consider predicting participants' primary social application use before analyzing their content to forecast behavior and mental states. The study holds the potential to revolutionize strategies and offer insights for scalable, accessible interventions while maintaining quality through comprehensive Facebook feature analysis. INTERNATIONAL REGISTERED REPORT IDENTIFIER (IRRID): DERR1-10.2196/55511.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 121); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.2196/55511.",
    },
  },
  {
    id: '2024-roles-technology-risk-communication-community',
    title:
      'Roles of Technology for Risk Communication and Community Engagement in Bangladesh during COVID-19 Pandemic',
    authors: [
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Sabbir Ahmed' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Shabana Khan' } },
    ],
    year: 2024,
    status: 'published',
    type: 'journal',
    venue: 'acm-jcss',
    doi: '10.1145/3648433',
    externalUrl: 'https://doi.org/10.1145/3648433',
    isOpenAccess: false,
    citationText:
      'Sinha, Anik, Nova Ahmed, Sabbir Ahmed, Ifti Azad Abeer, Rahat Jahangir Rony, Anik Saha, Syeda Shabnam Khan, Shajnush Amir, and Shabana Khan. "Roles of technology for risk communication and community engagement in Bangladesh during COVID-19 Pandemic." ACM Journal on Computing and Sustainable Societies 2, no. 2 (2024): 1-22.',
    abstract:
      'The COVID-19 pandemic required clear communication of risk and community engagement. A gap is noted in scholarly studies portraying strong community engagement for risk handling, particularly in resource-constrained regions in the HCI community. This study covers community engagement and its use of technology during COVID-19 through a qualitative study of Bangladesh. The study looks at marginalized communities who have struggled through the pandemic yet handled the difficult time through their effective problem solving, working together as a community when there was not enough support from authorities. It is a qualitative study during the pandemic consisting of nine communities, including 58 participants ( N = 58, Female = 33, Male = 23, Transgender = 2) across four divisions of Bangladesh covering urban, semi-urban, and rural regions. The study uncovers the challenges and close community structures. It also shows the enhanced and increased positive role of technology during the pandemic while also pointing out that a few communities were digitally disconnected and could benefit from digital connectivity in the future through increased awareness and support.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 131); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3648433.",
    },
  },
  {
    id: '2024-understanding-driving-stress-urban-bangladesh',
    title:
      'Understanding Driving Stress in Urban Bangladesh: An Exploratory Study, Wearable Development and Experiment',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Md. Sabbir Ahmed' } },
      { customAuthor: { name: 'Sayan Sarcar' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'journal',
    venue: 'acm-jcss',
    doi: '10.1145/3648434',
    externalUrl: 'https://doi.org/10.1145/3648434',
    isOpenAccess: true,
    citationText:
      'Rony, Rahat Jahangir, Md Sabbir Ahmed, Sayan Sarcar, and Nova Ahmed. "Understanding driving stress in urban Bangladesh: An exploratory study, wearable development and experiment." ACM Journal on Computing and Sustainable Societies 2, no. 2 (2024): 1-28.',
    abstract:
      "Driving stress significantly impacts driving behavior primarily from roadside factors, where driving is more challenging in developing countries (i.e., Bangladesh) for unique cultural and infrastructural setups. We conduct an exploratory study (Qualitative n = 26, and Subjective Feedback n = 80) and a correlational analysis involving professional and private car drivers in urban Bangladesh. The study reveals drivers' demography and driving stress factors on the road. These findings motivate us to identify driving stress from physiological factors by developing a low-cost wearable, Stress Wear . This can detect stress from varying Heart Rates, validated by expensive commercial wearables. Between subject experiments on drivers (total n = 14 in two phases) with wearables, we also found that road factors are responsible for driving stress. Therefore, the developed system is helpful for these drivers to self-sense their stress.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 129); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3648434.",
    },
  },
  {
    id: '2024-understanding-sociocultural-challenges-opportunities-affordable',
    title:
      'Understanding the Sociocultural Challenges and Opportunities for Affordable Wearables to Support Poststroke Upper-Limb Rehabilitation: Qualitative Study',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Samuelson Atiba' } },
      { customAuthor: { name: 'Nervo Verdezoto' } },
      { customAuthor: { name: 'Valerie Sparkes' } },
      { customAuthor: { name: 'Katarzyna Stawarz' } },
    ],
    year: 2024,
    status: 'published',
    type: 'journal',
    venueLabel: 'JMIR Rehabilitation and Assistive Technologies',
    doi: '10.2196/54699',
    externalUrl: 'https://doi.org/10.2196/54699',
    isOpenAccess: true,
    citationText:
      'Rony, Rahat Jahangir, Shajnush Amir, Nova Ahmed, Samuelson Atiba, Nervo Verdezoto, Valerie Sparkes, and Katarzyna Stawarz. "Understanding the Sociocultural Challenges and Opportunities for Affordable Wearables to Support Poststroke Upper-Limb Rehabilitation: Qualitative Study." JMIR Rehabilitation and Assistive Technologies 11 (2024): e54699.',
    abstract:
      "Background: People who survive a stroke in many cases require upper-limb rehabilitation (ULR), which plays a vital role in stroke recovery practices. However, rehabilitation services in the Global South are often not affordable or easily accessible. For example, in Bangladesh, the access to and use of rehabilitation services is limited and influenced by cultural factors and patients' everyday lives. In addition, while wearable devices have been used to enhance ULR exercises to support self-directed home-based rehabilitation, this has primarily been applied in developed regions and is not common in many Global South countries due to potential costs and limited access to technology. Objective: Our goal was to better understand physiotherapists', patients', and caregivers' experiences of rehabilitation in Bangladesh, existing rehabilitation practices, and how they differ from the rehabilitation approach in the United Kingdom. Understanding these differences and experiences would help to identify opportunities and requirements for developing affordable wearable devices that could support ULR in home settings. Methods: We conducted an exploratory study with 14 participants representing key stakeholder groups. We interviewed physiotherapists and patients in Bangladesh to understand their approaches, rehabilitation experiences and challenges, and technology use in this context. We also interviewed UK physiotherapists to explore the similarities and differences between the 2 countries and identify specific contextual and design requirements for low-cost wearables for ULR. Overall, we remotely interviewed 8 physiotherapists (4 in the United Kingdom, 4 in Bangladesh), 3 ULR patients in Bangladesh, and 3 caregivers in Bangladesh. Participants were recruited through formal communications and personal contacts. Each interview was conducted via videoconference, except for 2 interviews, and audio was recorded with consent. A total of 10 hours of discussions were transcribed. The results were analyzed using thematic analysis. Results: We identified several sociocultural factors that affect ULR and should be taken into account when developing technologies for the home: the important role of family, who may influence the treatment based on social and cultural perceptions; the impact of gender norms and their influence on attitudes toward rehabilitation and physiotherapists; and differences in approach to rehabilitation between the United Kingdom and Bangladesh, with Bangladeshi physiotherapists focusing on individual movements that are necessary to build strength in the affected parts and their British counterparts favoring a more holistic approach. We propose practical considerations and design recommendations for developing ULR devices for low-resource settings. Conclusions: Our work shows that while it is possible to build a low-cost wearable device, the difficulty lies in addressing sociotechnical challenges. When developing new health technologies, it is imperative to not only understand how well they could fit into patients', caregivers', and physiotherapists' everyday lives, but also how they may influence any potential tensions concerning culture, religion, and the characteristics of the local health care system.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 127); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.2196/54699.",
    },
  },
  {
    id: '2024-youth-driven-community-engaged-waste',
    title: 'Youth-Driven, Community-Engaged Waste Management',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Ashiq Khuda' } },
      { customAuthor: { name: 'Sumaiya Jerin Chowdhury' } },
      { customAuthor: { name: 'Tahira Rezwana' } },
      { customAuthor: { name: 'Md. Sharif- Ul Islam' } },
      { customAuthor: { name: 'Sumiya Sajjad' } },
    ],
    year: 2024,
    status: 'published',
    type: 'journal',
    venueLabel: 'The Journal of Community Informatics',
    doi: '10.15353/joci.v20i1.5289',
    externalUrl: 'https://doi.org/10.15353/joci.v20i1.5289',
    isOpenAccess: true,
    abstract:
      'The waste management process is important in Bangladesh where infectious and non-infectious diseases are common. In a resource constrained region, community engagement for waste management can add great value. A youth-initiated and engaged approach to collaboration among local communities is presented in this research. This research took place over a one and half year time frame in fifteen urban, suburban, and rural regions, consisting of 55 families and 15 individuals engaged in waste management activity. The youth leaders were eager to make changes, being frustrated at the authority’s inability to solve local pollution. The collaborative teams were able to continue the work through the time period using various technology platforms. The technology leadership of youth enabled a trusted connection among youth and community members. The research work shows promise to increase communication, collaboration, and collective engagement in local problem solving. However, engagement is not gender neutral, and the work presented reflects societal gender-based challenges which requires attention. This work is expected to provide opportunities for low-resource communities towards problem solving using existing technology platforms.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.15353/joci.v20i1.5289.",
    },
  },
  {
    id: '2024-now-i-am-socially-well',
    title:
      '“Now I am Socially Well Respected” - From being Bullied in the Society to being Important Community Member',
    authors: [
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Md Ulfat Tahsin' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2024,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3613905.3651062',
    externalUrl: 'https://doi.org/10.1145/3613905.3651062',
    isOpenAccess: true,
    citationText:
      'Abeer, Ifti Azad, Anik Sinha, Rahat Jahangir Rony, Anik Saha, Md Ulfat Tahsin, Syeda Shabnam Khan, and Nova Ahmed. "“Now I am Socially Well Respected”-From being Bullied in the Society to being Important Community Member." In Extended Abstracts of the CHI Conference on Human Factors in Computing Systems, pp. 1-8. 2024.',
    abstract:
      'People with Disabilities (PWDs) struggle in different aspects of their lives, especially in resource-constrained regions like South Asia. The role of Mobile Financial Services (MFS) in improving their lives has been emphasized in literature where works in the South Asian region focus on the challenges of MFS adoption for PWDs. This research focuses on the opportunities of the impact of MFS on PWDs in low-resource context. It considers n=20 PWDs in Bangladesh who were mostly technology familiar. Participants shared their struggles while seeking education and employment. MFS along with their technology familiarity facilitated them to engage in financial activities and empower themselves to change their societal and financial status. Many participants overcame their socio-economic struggles despite living in resource-constrained regions through their technological skills paired with efficient MFS usage. This paper presents the potential of community-centric work-oriented technology training focusing on efficient MFS usage for PWDs in resource-constrained communities.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 135); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3613905.3651062.",
    },
  },
  {
    id: '2023-fast-minimal-system-identify-depression',
    title:
      'A Fast and Minimal System to Identify Depression Using Smartphones: Explainable Machine Learning–Based Approach',
    authors: [
      { customAuthor: { name: 'Md Sabbir Ahmed' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2023,
    status: 'published',
    type: 'journal',
    venue: 'jmir-form-res',
    doi: '10.2196/28848',
    externalUrl: 'https://doi.org/10.2196/28848',
    isOpenAccess: true,
    abstract:
      "BACKGROUND: Existing robust, pervasive device-based systems developed in recent years to detect depression require data collected over a long period and may not be effective in cases where early detection is crucial. Additionally, due to the requirement of running systems in the background for prolonged periods, existing systems can be resource inefficient. As a result, these systems can be infeasible in low-resource settings. OBJECTIVE: Our main objective was to develop a minimalistic system to identify depression using data retrieved in the fastest possible time. Another objective was to explain the machine learning (ML) models that were best for identifying depression. METHODS: We developed a fast tool that retrieves the past 7 days' app usage data in 1 second (mean 0.31, SD 1.10 seconds). A total of 100 students from Bangladesh participated in our study, and our tool collected their app usage data and responses to the Patient Health Questionnaire-9. To identify depressed and nondepressed students, we developed a diverse set of ML models: linear, tree-based, and neural network-based models. We selected important features using the stable approach, along with 3 main types of feature selection (FS) approaches: filter, wrapper, and embedded methods. We developed and validated the models using the nested cross-validation method. Additionally, we explained the best ML models through the Shapley additive explanations (SHAP) method. RESULTS: Leveraging only the app usage data retrieved in 1 second, our light gradient boosting machine model used the important features selected by the stable FS approach and correctly identified 82.4% (n=42) of depressed students (precision=75%, F1-score=78.5%). Moreover, after comprehensive exploration, we presented a parsimonious stacking model where around 5 features selected by the all-relevant FS approach Boruta were used in each iteration of validation and showed a maximum precision of 77.4% (balanced accuracy=77.9%). Feature importance analysis suggested app usage behavioral markers containing diurnal usage patterns as being more important than aggregated data-based markers. In addition, a SHAP analysis of our best models presented behavioral markers that were related to depression. For instance, students who were not depressed spent more time on education apps on weekdays, whereas those who were depressed used a higher number of photo and video apps and also had a higher deviation in using photo and video apps over the morning, afternoon, evening, and night time periods of the weekend. CONCLUSIONS: Due to our system's fast and minimalistic nature, it may make a worthwhile contribution to identifying depression in underdeveloped and developing regions. In addition, our detailed discussion about the implication of our findings can facilitate the development of less resource-intensive systems to better understand students who are depressed and take steps for intervention.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2196/28848.",
    },
  },
  {
    id: '2023-minimalistic-approach-predict-understand-relation',
    title:
      "A Minimalistic Approach to Predict and Understand the Relation of App Usage with Students' Academic Performance",
    authors: [
      { customAuthor: { name: 'Md Sabbir Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Mohammad Abdul Hadi' } },
      { customAuthor: { name: 'Ekram Hossain' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2023,
    status: 'published',
    type: 'journal',
    venue: 'pacm-hci',
    doi: '10.1145/3604240',
    externalUrl: 'https://doi.org/10.1145/3604240',
    isOpenAccess: true,
    abstract:
      "Due to usage of self-reported data which may contain biasness, the existing studies may not unveil the exact relation between academic grades and app categories such as Video. Additionally, the existing systems' requirement for data of prolonged period to predict grades may not facilitate early intervention to improve it. Thus, we presented an app that retrieves past 7 days' actual app usage data within a second (Mean=0.31s, SD=1.1s). Our analysis on 124 Bangladeshi students' real-time data demonstrates app usage sessions have a significant (p<0.05) negative association with CGPA. However, the Productivity and Books categories have a significant positive association whereas Video has a significant negative association. Moreover, the high and low CGPA holders have significantly different app usage behavior. Leveraging only the instantly accessed data, our machine learning model predicts CGPA within ±0.36 of the actual CGPA. We discuss the design implications that can be potential for students to improve grades.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3604240.",
    },
  },
  {
    id: '2023-advancing-hci-research-education-within',
    title: 'Advancing HCI Research and Education within and across South Asia',
    authors: [
      { customAuthor: { name: 'Dilrukshi Gamage' } },
      { customAuthor: { name: 'Asra Sakeen Wani' } },
      { customAuthor: { name: 'Pranjal Jain' } },
      { customAuthor: { name: 'Deepak Ranjan Padhi' } },
      { customAuthor: { name: 'Pranjal Protim Borah' } },
      { customAuthor: { name: 'Ambika R Menon' } },
      { customAuthor: { name: 'Wricha Mishra' } },
      { customAuthor: { name: 'Muneeb Ahmad' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Sayan Sarcar' } },
      { customAuthor: { name: 'Suleman Shahid' } },
      { customAuthor: { name: 'Devanuj Kanta Balkrishan' } },
    ],
    year: 2023,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3544549.3573815',
    externalUrl: 'https://doi.org/10.1145/3544549.3573815',
    isOpenAccess: true,
    abstract:
      'With the advancements in technologies, the need for Human’s perspective and human-centered designs are in much demand and its essential to understand diverse cultural needs. The community in South Asia has been recognized to have a unique and diverse socio-cultural, political, infrastructural, and geographical background of the region. However, we continue to see that the studies presented to the CHI community about South Asia primarily focus on working with and unpacking the regional contextual constraints (of the users and the infrastructures), thus taking a developmental stance. We witness a lack of HCI work presented by South Asian research community promoting diverse methods, cultures and behaviors. We believe this is due to limited experience in the field and resources. In this online workshop, we take advanced steps to operationalize collaborations and resource sharing between HCI researchers by presenting their half-baked ideas, presenting published HCI work on other venues, or even sharing challenges faced in a Rejected HCI work in the context of South Asia. Our aim is to broaden the perspective of the CHI research and community towards the contributions from the region including and beyond development, by bringing together researchers, designers, and practitioners working or are interested in working within these regions on diverse topics.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3544549.3573815.",
    },
  },
  {
    id: '2023-hci-across-borders-global-solidarity',
    title: 'HCI Across Borders: Towards Global Solidarity',
    authors: [
      { customAuthor: { name: 'Vikram Kamath Cannanure' } },
      { customAuthor: { name: 'Delvin Varghese' } },
      { customAuthor: { name: 'Cuauhtémoc Rivera-Loaiza' } },
      { customAuthor: { name: 'Faria Noor' } },
      { customAuthor: { name: 'Dipto Das' } },
      { customAuthor: { name: 'Pranjal Jain' } },
      { customAuthor: { name: 'Meiyin Chang' } },
      { customAuthor: { name: 'Marisol Wong-Villacres' } },
      { customAuthor: { name: 'Naveena Karusala' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Sarina C Till' } },
      { customAuthor: { name: 'Bernard Ijesunor Akhigbe' } },
      { customAuthor: { name: 'Melissa Densmore' } },
      { customAuthor: { name: 'Susan Dray' } },
      { customAuthor: { name: 'Christian Sturm' } },
      { customAuthor: { name: 'Neha Kumar' } },
    ],
    year: 2023,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3544549.3573806',
    externalUrl: 'https://doi.org/10.1145/3544549.3573806',
    isOpenAccess: true,
    abstract:
      'Recent global developments, such as the war in Ukraine and uprisings in Iran, motivate this year’s HCI Across Borders (HCIxB) workshop at CHI 2023, asking how we can foster greater global solidarity. Our workshop aims to brainstorm and discuss pathways to engage in solidarity as a global research, practice, and education community. HCIxB has already gathered a diverse audience annually by conducting workshops and symposia annually since CHI 2016. At CHI 2023, we hope to hold a hybrid workshop to focus on themes of solidarity and resilience, and how we might support and nurture the growth of a diverse and growing body of students and early career researchers across the SIGCHI community.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3544549.3573806.",
    },
  },
  {
    id: '2023-intersection-gender-technology-bangladesh-dhaka',
    title: 'Intersection of Gender and Technology in Bangladesh: Dhaka Phase',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'MD. Sabbir Ahmed' } },
      { customAuthor: { name: 'Zareen Tasnim' } },
      { customAuthor: { name: 'Kimia Tuz Zaman' } },
    ],
    year: 2023,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'SSRN Electronic Journal',
    doi: '10.2139/ssrn.4487452',
    externalUrl: 'https://doi.org/10.2139/ssrn.4487452',
    isOpenAccess: true,
    abstract:
      'Bangladesh is a developing country in South Asia, where the majority of women face a lack of technology exposure because of cultural barriers, norms, and technology literacy. Such factors work as barriers in women’s growth where digital financial inclusion helps women empowerment and equitable decision-making. For the lack of technology exposure, they face difficulties in involving digital financial inclusion. However, the global COVID-19 pandemic opened opportunities to adopt technology for all as well as for women, and traditional banking systems are switching to digital systems where financial technology (fintech) plays an important role in continuing the financial process. In this particular context, the scenario of developing regions is different from developed nations.This research explores n=80 participants, mostly focuses on women from 12 different professions, 18-65+ age ranges, and socioeconomic backgrounds (low, middle and high-income) based on World Bank and Pew research stratification in urban (Dhaka City) and non-urban (Tangail district) region in Dhaka division of Bangladesh as a pilot study of six months. The study has qualitatively interviewed 63 Females (79%), 15 Males (19%), and 2 Transgenders (2%), through focus group discussions (FGD) during the COVID-19 pandemic in Bangladesh. In this report, we discuss participants’ societal status, current financial situation, technology usage scenarios, the impact of COVID on finance and fintech adoption, and lastly their perceptions of better fintech design which represent the context of women in Bangladesh with several points of views with the support of the literature review, and analysis of qualitative data. We have also done text analysis and statistical analysis from the qualitative outcomes. Through this research, the notable findings are:Societal Structure: Society plays an important role in women’s empowerment through family support (e.g., educational support from parents), and community support (e.g., financial support during an emergency). However, societal structure causes social prejudice (e.g: educated females face difficulties during marriage in low-income families) that works as a barrier to women’s opportunities.Women and Finance: The working women take financial responsibilities for their families. Financial responsibilities are equally distributed in low-income families (e.g., Ready-made garment workers) whereas in high-income families (e.g., corporate service holders) women’s earnings are considered as an extra when their husbands contribute enough. However, women from low-income families have limited financial exposure (e.g., structural barriers for going to banks, interest in informal banking), and an information gap about banks (e.g., negative perceptions about banking). Another factor is working women lack risk-taking behavior (e.g., not interested in acquiring bank loans to expand business) because of low confidence.Technology and Fintech Experience: Technology and fintech adoption are challenging for low-literate users because of technology complexities (e.g., application interface difficulties), lacking technology literacy (e.g., no formal learning), and discomfort to seek technology support (e.g., women cannot ask randomly for support due to societal norms). However, the majority of the participants have connections with technology and fintech in direct or indirect ways.Fintech during the COVID-19 Pandemic: Since the COVID-19 pandemic impacted everyone financially, fintech helped in continuing basic financial operation (e.g., money transaction) and also added opportunities for using technology (e.g., online payment through fintech). However, many of the participants faced negative experiences (e.g., fraud incidents) during the use of fintech. In addition, this initiated a wide digital divide where low-literate and low-income participants fell behind in accessing existing fintech options.Better Fintech: User Perception: The participants required an easy and secured fintech application interface (e.g, fewer technical steps with appropriate security features) along with saving facilities (e.g., saving small amounts digitally) in fintech applications that might encourage low-income communities to grow saving tendency as per their perception. Additionally, they are in need of local area-based help centers for fintech to get accessible and immediate support.Through this study, we explored wide dimensions of understanding the gender and technology’s intersection in the context of Bangladesh. The findings of this report motivate us to propose some intervention techniques as technology interventions (e.g., easy, secured, and accessible fintech interface), infrastructure interventions (e.g., establishing help centers, training of agents, handling fintech abuse), and policy interventions (e.g., leveraging existing databases, providing financial literacy, encouraging formal banking and saving) that might facilitate all the stakeholders. Finally, through the discussion, we addressed three points as fintech aspect (e.g., the importance and requirement of using secured fintech interface), financial aspect (e.g., the importance of financial literacy, an alternate source of loan and financial engagement), and social aspect (e.g., discussion on financial responsibilities and technology learning and usage centers) that justified our findings with existing literature and the systems and approaches adopted in other countries.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2139/ssrn.4487452.",
    },
  },
  {
    id: '2023-intersection-gender-technology-bangladesh-stakeholders',
    title: 'Intersection of Gender and Technology in Bangladesh: Stakeholders Engagement',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Md. Sabbir Ahmed' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Gazi Fakhrul Islam' } },
    ],
    year: 2023,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'SSRN Electronic Journal',
    doi: '10.2139/ssrn.4487384',
    externalUrl: 'https://doi.org/10.2139/ssrn.4487384',
    isOpenAccess: true,
    abstract:
      "Bangladesh is a developing country in South Asia, where around half of the population is women. The majority of the women are not engaged in economic sectors for several reasons. One particular reason is Bangladesh's practice of patriarchal values which results in discrimination between genders affecting women’s economic participation. The gender disparity in economic participation is a common phenomenon in developing countries, as discussed in previous scholarly articles. Digital financial inclusion can improve this situation, reducing the gender gap in developing countries. However digital financial inclusion there requires technical literacy and access to technology which remains a challenge for women in developing nations. In this report, we tried to explain from stakeholders' viewpoint, how the users, particularly the women as beneficiaries can access digital financial services considering the barriers in the context of Bangladesh.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2139/ssrn.4487384.",
    },
  },
  {
    id: '2023-mfs-design-appstore-enabled-smart',
    title:
      'MFS Design in Appstore-enabled Smart Featurephones for Low-literate, Marginalized Communities',
    authors: [
      { customAuthor: { name: 'Mohammad Rayed' } },
      { customAuthor: { name: 'Tawfique Elahi' } },
      { customAuthor: { name: 'Shaikh Shawon Arefin Shimon' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2023,
    status: 'published',
    type: 'conference',
    venue: 'chi',
    doi: '10.1145/3544548.3580661',
    externalUrl: 'https://doi.org/10.1145/3544548.3580661',
    isOpenAccess: false,
    featured: true,
    abstract:
      'Mobile Financial Services (MFS) has gained significant popularity during the COVID-19 pandemic, especially among marginalized and low-income, low-literate communities around the world. Such communities have not been traditionally considered while designing MFS services via smartphone apps or USSD services in featurephones. Financial constraints limit such end-users towards basic featurephones, where recent appstore support has made it possible to deploy app-based MFS solutions beyond USSD. This new featurephone platform is a relatively underexplored area in terms of addressing design issues related to aforementioned end-users while developing MFS solutions. Our work addresses this gap by presenting qualitative findings on barriers to technology access focused on MFS solutions in marginal communities. We present a prototype non-USSD, app-based solution on an appstore-supported featurephone platform designed via a human-centered approach. This work has the potential to increase the financial inclusivity of marginalized communities in cashless MFS transactions via low-cost, appstore-enabled featurephones.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3544548.3580661.",
    },
  },
  {
    id: '2023-stories-beneath-needle-understanding-ready',
    title: 'Stories Beneath Needle: Understanding Ready Made Garment Workers of Bangladesh',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Kimia Tuz Zaman' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2023,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'SSRN Electronic Journal',
    doi: '10.2139/ssrn.4499616',
    externalUrl: 'https://doi.org/10.2139/ssrn.4499616',
    isOpenAccess: true,
    abstract:
      "In Bangladesh, around 4 million garment workers are working in more than five thousand garment factories all around the country. Most of the factories are situated in Dhaka and Chittagong divisions in Bangladesh along with the membership of BGMEA (Bangladesh Garment Manufacturers and Exports Association) and BKMEA (Bangladesh Knitwear Manufacturers and Exports Association). Among these garments, there are compliant garments that follow the code of conduct of workers’ rights, and the rest of them are non-compliant garments that often violate the code of conduct of workers’ rights. In this particular scenario, workers’ have different experiences in their workplaces, which has significant impacts on their lifestyle.This study explores to understand garments workers' lifestyles briefly, through conducting qualitative interviews with 55 garment workers (32 workers were female and 23 workers were male) from 40 different garments in 6 different groups. In this report, we discuss the several areas of workers' life, which represent the scenarios of all garment workers, with the support of the literature review, and the analysis of quantitative and qualitative data. We identified the challenges and qualities of workers' daily life, and suggest a possible tool that might make their life easy and better.We examine five keynote areas of workers' life as social connectivity, financial stability, technology integration, job environment, and healthcare. The notable findings are:• The majority of the workers don’t have a significant educational background; especially, female workers are lagging. These workers are migrated from low-income regions such as northern and southern regions of Bangladesh.• Workers have very good social connections with neighbors, co-workers, house owners, shop keepers, and local mobile financing agents.• Workers have a very low income, starting from BDT 8000/month (equivalent to USD 94.22) with numerous areas of expenses, including kids’ education cost, monthly expenditures cost, house rent, etc. On the other hand, they struggle to save money on monthly basis with such expenses forlacking proper management of their salary where sometimes they make loans for expenses.• The adaptation of technology usage is very less in proportion to the availability of technology. They all are familiar with and have access to both feature phones and smartphones, and usage of basic calling applications is common.• Workers often struggle in getting a new job because of the traditional recruitment process. Apart from that, workers of non-compliant garments have several negative experiences while workers from compliant garments have very friendly and comfortable experiences in their workplaces.• The majority of the workers are not aware of personal healthcare and they avoid spending money on visiting doctors during their illness.To date, no such study explored these dimensions to understand the workers' life in a particular sector. This study comes up with a question that, do we able to support workers to get a better lifestyle? The findings of this report motivate us to suggest and design an easy user-friendly Bengali crowdsourcing platform that might reduce the basic daily complexities of the workers.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2139/ssrn.4499616.",
    },
  },
  {
    id: '2022-my-mom-took-my-phone',
    title:
      "'My Mom took My Phone and Locked It in the Wardrobe': Parental Mediation in Teen-Parent Relationship in Technology Usage from Teens Perspective in Bangladesh",
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'SSRN Electronic Journal',
    doi: '10.2139/ssrn.4000430',
    externalUrl: 'https://doi.org/10.2139/ssrn.4000430',
    isOpenAccess: true,
    abstract:
      "The teen-parent relationship is studied from the perspective of teens relating to the usage of technology in the context of urban Bangladesh. We studied n=28 teens of different socioeconomic statuses and school systems qualitatively. The study uncovers the current state of teen-parent relationships where parental mediation on teens' technology usage impacts the relationship. Parents of middle and lower-income families want to control the technology usage of female teens for cyber abuse-related concerns. This parental restrictive mediation negatively impacts teen-parent relationships. Also, teens from higher-income families hide their online activities from their parents for fear of monitoring and often exclude parents in their cyberspace. As a result, there create strong barriers in online relationships with parents that refer to distant relationships between them. However, a good understanding regarding technology usage between teens and parents impacts the relationship positively. Based on our findings, we have presented design implications that can ensure a safe online platform for teens, co-sharing transparent technology usage space, and community level discussion platform, for both teens and parents to promote a good relationship between teens and parents.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2139/ssrn.4000430.",
    },
  },
  {
    id: '2022-low-cost-wearable-system-support',
    title:
      'A low-cost wearable system to support upper limb rehabilitation in resource-constrained settings',
    authors: [
      { customAuthor: { name: 'Sabbir Ahmed, Md' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Samuelson Atiba' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nervo Verdezoto' } },
      { customAuthor: { name: 'Valerie Sparkes' } },
      { customAuthor: { name: 'Katarzyna Stawarz' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'pervasivehealth',
    pdf: { link: 'https://orca.cardiff.ac.uk/154233' },
    citationText:
      'Sabbir Ahmed, Md, Shajnush Amir, Samuelson Atiba, Rahat Jahangir Rony, Nervo Verdezoto, Valerie Sparkes, Katarzyna Stawarz, and Nova Ahmed.2022. A low-cost wearable system to support upper limb rehabilitation in resource-constrained settings. Presented at: EAI PervasiveHealth 2022 - 16th EAI International Conference on Pervasive Computing Technologies for Healthcare, Thessaloniki, Greece, 12-14 December 2022.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 164); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-challenges-women-computing-bangladesh-considering',
    title:
      'Challenges for women in computing in Bangladesh considering the learning and workplace environment over a period of eight years',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Lamia Iftekhar' } },
      { customAuthor: { name: 'Mahbuba Tasmin' } },
      { customAuthor: { name: 'Tamanna Islam Urmi' } },
      { customAuthor: { name: 'Silvia Ahmed' } },
      { customAuthor: { name: 'Tamanna Motahar' } },
    ],
    year: 2022,
    status: 'published',
    type: 'journal',
    venueLabel: 'SN Social Sciences',
    doi: '10.1007/s43545-022-00529-y',
    externalUrl: 'https://doi.org/10.1007/s43545-022-00529-y',
    isOpenAccess: false,
    citationText:
      'Ahmed, Nova, Lamia Iftekhar, Mahbuba Tasmin, Tamanna Islam Urmi, Silvia Ahmed, and Tamanna Motahar. "Challenges for women in computing in Bangladesh considering the learning and workplace environment over a period of eight years."SN Social Sciences 2, no. 10 (2022): 227.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 166); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1007/s43545-022-00529-y.",
    },
  },
  {
    id: '2022-deep-learning-approach-classifying-aggressive',
    title:
      'Deep Learning Approach for Classifying the Aggressive Comments on Social Media: Machine Translated Data Vs Real Life Data',
    authors: [
      { customAuthor: { name: 'Akter, Mst Shapna' } },
      { customAuthor: { name: 'Hossain Shahriar' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Alfredo Cuzzocrea' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venueLabel: '2022 IEEE International Conference on Big Data (Big Data)',
    citationText:
      'Akter, Mst Shapna, Hossain Shahriar, Nova Ahmed, and Alfredo Cuzzocrea. "Deep Learning Approach for Classifying the Aggressive Comments on Social Media: Machine Translated Data Vs Real Life Data." In 2022 IEEE International Conference on Big Data (Big Data), pp. 5646-5655. IEEE, 2022.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 160); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-development-low-cost-wearable-upper',
    title: 'Development of A Low Cost Wearable for Upper-limb Functional Rehabilitation',
    authors: [
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Nervo Verdezoto Dias' } },
      { customAuthor: { name: 'Samuelson Atiba' } },
      { customAuthor: { name: 'Valerie Sparkes' } },
      { customAuthor: { name: 'Katarzyna Stawarz' } },
    ],
    year: 2022,
    status: 'accepted-in-press',
    type: 'conference',
    venueLabel: '9th World Congress of Biomechanics 2022, Taipei',
    citationText:
      'Shajnush Amir, Rahat Jahangir Rony, Nova Ahmed, Nervo Verdezoto Dias, Samuelson Atiba, Valerie Sparkes, Katarzyna Stawarz. 2022. Development of A Low Cost Wearable for Upper-limb Functional Rehabilitation. 9th World Congress of Biomechanics 2022. Taipei (Accepted)',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 156); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-exploring-technology-usage-southeast-asian',
    title:
      'Exploring Technology Usage of Southeast Asian Elderly Women for Better Mental Health during COVID-19 Pandemic',
    authors: [
      { customAuthor: { name: 'Motahar, Tamanna' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    citationText:
      'Motahar, Tamanna, and Nova Ahmed. "Exploring Technology Usage of Southeast Asian Elderly Women for Better Mental Health during COVID-19 Pandemic." In CHI Conference on Human Factors in Computing Systems Extended Abstracts, pp. 1-7. 2022.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 176); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-exploring-unique-app-signature-depressed',
    title:
      'Exploring Unique App Signature of the Depressed and Non-depressed Through Their Fingerprints on Apps',
    authors: [
      { customAuthor: { name: 'Md. Sabbir Ahmed' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'book-chapter',
    venue: 'pervasivehealth',
    doi: '10.1007/978-3-030-99194-4_15',
    externalUrl: 'https://doi.org/10.1007/978-3-030-99194-4_15',
    isOpenAccess: false,
    citationText:
      'Ahmed, Md Sabbir, and Nova Ahmed. "Exploring unique app signature of the depressed and non-depressed through their fingerprints on apps." In Pervasive Computing Technologies for Healthcare: 15th EAI International Conference, Pervasive Health 2021, Virtual Event, December 6-8, 2021, Proceedings, pp. 218-239. Cham: Springer International Publishing, 2022.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 180); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1007/978-3-030-99194-4_15.",
    },
  },
  {
    id: '2022-hci-knowledge-dissemination-south-asia',
    title:
      'HCI Knowledge Dissemination in South Asia through both Coursework and Community Engagement',
    authors: [
      { customAuthor: { name: 'Jain, Pranjal' } },
      { customAuthor: { name: 'Anirudh Nagraj' } },
      { customAuthor: { name: 'Kartik Joshi' } },
      { customAuthor: { name: 'Taru Jain' } },
      { customAuthor: { name: 'Dilrukshi Gamage' } },
      { customAuthor: { name: 'Sayan Sarcar' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    citationText:
      'Jain, Pranjal, Anirudh Nagraj, Kartik Joshi, Taru Jain, Dilrukshi Gamage, Sayan Sarcar, and Nova Ahmed. "HCI Knowledge Dissemination in South Asia through both Coursework and Community Engagement." (2022).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 184); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-impact-socio-economic-factors-female',
    title:
      'Impact of socio-economic factors on female students’ enrollments in science, technology, engineering and mathematics and workplace challenges in Bangladesh',
    authors: [
      { customAuthor: { name: 'Ahmed, Nova' } },
      { customAuthor: { name: 'Arshad M. Chowdhury' } },
      { customAuthor: { name: 'Tamanna Urmi' } },
      { customAuthor: { name: 'Lafifa Jamal' } },
    ],
    year: 2022,
    status: 'published',
    type: 'journal',
    venueLabel: 'American Behavioral Scientist',
    citationText:
      'Ahmed, Nova, Arshad M. Chowdhury, Tamanna Urmi, and Lafifa Jamal. "Impact of socio-economic factors on female students’ enrollments in science, technology, engineering and mathematics and workplace challenges in Bangladesh." American Behavioral Scientist (2022): 00027642221078517.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 186); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-less-more-leveraging-digital-behavioral',
    title:
      'Less Is More: Leveraging Digital Behavioral Markers for Real-Time Identification of Loneliness in Resource-Limited Settings',
    authors: [
      { customAuthor: { name: 'Ahmed, Md Sabbir' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'pervasivehealth',
    citationText:
      'Ahmed, Md Sabbir, and Nova Ahmed. "Less Is More: Leveraging Digital Behavioral Markers for Real-Time Identification of Loneliness in Resource-Limited Settings." (2022). Presented at: EAI PervasiveHealth 2022 - 16th EAI International Conference on Pervasive Computing Technologies for Healthcare, Thessaloniki, Greece, 12-14 December 2022.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 162); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-liberating-stories-about-terrorist-attack',
    title: 'Liberating Stories about a Terrorist Attack',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Zareen Tasnim' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/3572334.3572380',
    externalUrl: 'https://doi.org/10.1145/3572334.3572380',
    isOpenAccess: true,
    abstract:
      'In recent years, there has been a digital revolution in Bangladesh. We have explored digital storytelling among families as a way of sharing personal feelings, experiences regarding a terrorist attack that took place four years ago. Many of these feelings were not shared explicitly for various social, political reasons hampering freedom of expression. The goal of the work was to ensure social justice through ways to express feelings in a trusted platform. The research explored seventeen families over fifty stories using ethnographic study methods. Storytellers were able to express themselves through family-storytelling. We have used a simple tool named Golpokotha, a mobile application that enables secured storytelling that remains private unless the user prefers to share it with other family members. Contribution of this work lies in unveiling the overall picture exploring storytelling as a medium of expression from the trauma of a national crisis from a developing country perspective. We found that most of the participants went through silence, fear, humiliations, blame game, and stigma after the crisis which resisted expressing themselves through stories. Participants chose to overcome these barriers through their sense of responsibility, optimism, and social isolation. In the long run, their inspirations and reminiscence of innocent victims’ contributions motivated them to return to their normal life before the attack. Overall, our findings suggest liberating stories, designs, and policies to combat challenging times.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3572334.3572380.",
    },
  },
  {
    id: '2022-note-cheating-morality-problems-tertiary',
    title:
      'Note: Cheating and Morality Problems in the Tertiary Education Level: A COVID-19 Perspective in Bangladesh',
    authors: [
      { customAuthor: { name: 'Tahsin, Md Ulfat' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    citationText:
      'Tahsin, Md Ulfat, Ifti Azad Abeer, and Nova Ahmed. "Note: Cheating and Morality Problems in the Tertiary Education Level: A COVID-19 Perspective in Bangladesh." In ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies (COMPASS), pp. 589-595. 2022.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 170); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-note-importance-digital-profile-pictures',
    title:
      'Note: Importance of Digital Profile Pictures on Social Media Perceived by Different Groups',
    authors: [
      { customAuthor: { name: 'Das, Dipto' } },
      { customAuthor: { name: 'Malay Bhattacharyya' } },
      { customAuthor: { name: 'Laura S. Gaytan-Lugo' } },
      { customAuthor: { name: 'Ebtisam Alabdulqader' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    citationText:
      'Das, Dipto, Malay Bhattacharyya, Laura S. Gaytan-Lugo, Ebtisam Alabdulqader, and Nova Ahmed. "Note: Importance of Digital Profile Pictures on Social Media Perceived by Different Groups." In ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies (COMPASS), pp. 545-555. 2022.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 172); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-open-science-whom',
    title: 'Open Science – For Whom?',
    authors: [
      { customAuthor: { name: 'Martin Dominik' } },
      { customAuthor: { name: 'Justine Germo Nzweundji' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Sandro Carnicelli' } },
      { customAuthor: { name: 'Nurzatil Sharleeza Mat Jalaluddin' } },
      { customAuthor: { name: 'David Fernandez Rivas' } },
      { customAuthor: { name: 'Vanny Narita' } },
      { customAuthor: { name: 'Shymaa Enany' } },
      { customAuthor: { name: 'Clarissa Rios Rojas' } },
    ],
    year: 2022,
    status: 'published',
    type: 'journal',
    venueLabel: 'Data Science Journal',
    doi: '10.5334/dsj-2022-001',
    externalUrl: 'https://doi.org/10.5334/dsj-2022-001',
    isOpenAccess: true,
    citationText:
      'Dominik, Martin, Justine Germo Nzweundji, Nova Ahmed, Sandro Carnicelli, Nurzatil Sharleeza Mat Jalaluddin, David Fernandez Rivas, Vanny Narita, Shymaa Enany, and Clarissa Rios Rojas. "Open Science–for whom?." Data Science Journal (2022).',
    abstract:
      'Who can participate in Open Science and whose interests are served? Open Science in principle holds the potential to reduce inequality, but this is not going to happen unless it operates within a consistent framework and environment that supports this goal. Unequal power and opportunities from institutional to global level constitutes a major obstacle to human development, while we need to appreciate diversity as a key asset. How can we build an equitable global research ecosystem in accordance with the United Nations 2030 Agenda for Sustainable Development that recognises science as a global common good and an integral part of the shared cultural heritage of humankind?',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 182); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.5334/dsj-2022-001.",
    },
  },
  {
    id: '2022-opportunities-women-computing-perspective-bangladesh',
    title: 'Opportunities for Women in Computing: Perspective of Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Tamanna Motahar' } },
      { customAuthor: { name: 'Silvia Ahmed' } },
      { customAuthor: { name: 'Tamanna Urmi' } },
      { customAuthor: { name: 'Mahbuba Tasnim' } },
      { customAuthor: { name: 'Lamia Iftekhar' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/3572334.3572369',
    externalUrl: 'https://doi.org/10.1145/3572334.3572369',
    isOpenAccess: true,
    abstract:
      "This work presents a series of studies aiming to explore challenges and opportunities for women pursuing education or profession in the computing field. The work is based on the framework of Naila Kabeer considering access, agency and achievement as elements of women's empowerment. The study methods adopted included exploratory and qualitative analysis, whereas the data collection process incorporated two in-person surveys (N=120, F=85); ten one-to-one interviews (N=10, F=10); eight focus group discussions (N=46, F=34), four seminars covering more than 200 female members (N=239, F=239) and finally, two observations on more than one thousand participants of programming engagements (N=1402, F=1402); considering students, educators and other stakeholders as participants. Our research work exhibits dedicated efforts to ensure opportunities based on Naila Kabeer's framework for women in computing from Bangladesh.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3572334.3572369.",
    },
  },
  {
    id: '2022-risk-communication-community-engagement-during',
    title: 'Risk communication and community engagement during COVID-19',
    authors: [
      { customAuthor: { name: 'Khan, Shabana' } },
      { customAuthor: { name: 'Jyoti Mishra' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Chioma Daisy Onyige' } },
      { customAuthor: { name: 'Kuanhui Elaine Lin' } },
      { customAuthor: { name: 'Renard Siew' } },
      { customAuthor: { name: 'Boon Han Lim' } },
    ],
    year: 2022,
    status: 'published',
    type: 'journal',
    venueLabel: 'International Journal of Disaster Risk Reduction 74 (2022): 102903',
    citationText:
      'Khan, Shabana, Jyoti Mishra, Nova Ahmed, Chioma Daisy Onyige, Kuanhui Elaine Lin, Renard Siew, and Boon Han Lim. "Risk communication and community engagement during COVID-19."International Journal of Disaster Risk Reduction 74 (2022): 102903.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 174); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-risk-communication-during-covid-19',
    title: 'Risk Communication During COVID-19 Pandemic: Impacting Women in Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Md. Sabbir Ahmed' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Tanvir Hasan Fuad' } },
    ],
    year: 2022,
    status: 'published',
    type: 'journal',
    venueLabel: 'Frontiers in Communication',
    doi: '10.3389/fcomm.2022.878050',
    externalUrl: 'https://doi.org/10.3389/fcomm.2022.878050',
    isOpenAccess: true,
    citationText:
      'Nova Ahmed, Rahat Jahangir Rony, Anik Sinha, Md. Sabbir Ahmed, Anik Saha, Syeda Shabnam Khan, Ifti Azad Abeer, Shajnush Amir, Tanvir Hasan Fuad. 2022. "Risk Communication during COVID-19 Pandemic: Impacting Women in Bangladesh". Frontiers in Communication:Disaster Communications. DOI: 10.3389/fcomm.2022.878050',
    abstract:
      'Risk communication during COVID-19 is essential to have support, but it is challenging in developing countries due to a lack of communication setup. It is more difficult for the low-income, marginal communities, and specifically, women in developing countries. To understand this, particularly during the COVID-19 pandemic, we conducted a qualitative study among N = 37 women (urban 20, rural = 17) across Bangladesh that presents the risk communication factors related to social and financial challenges. It reveals that the majority of the urban communities lack communication with local authorities, where urban low-income communities are the worst sufferers. Due to that, the majority of the urban participants could not get financial support, whereas the rural participants received such support for having communications with local authorities during the pandemic. However, access to technology helped some participants share and receive pandemic-related information about risk communication, and the adoption of financial technology helped to get emergency financial support through risk communication. Moreover, this work is expected to understand the role of risk communication during the COVID-19 pandemic among women in Bangladesh.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 146); DOI stated in the NSU citation (not in ORCID); metadata from Crossref/OpenAlex for DOI 10.3389/fcomm.2022.878050.',
    },
  },
  {
    id: '2022-structured-training-enabler-women-ict',
    title: 'Structured Training as an Enabler for Women in ICT',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Munir Hasan' } },
    ],
    year: 2022,
    status: 'accepted-in-press',
    type: 'conference',
    venue: 'ieee-tale',
    citationText:
      'Nova Ahmed, Anik Sinha, Anik Saha, Rahat Jahangir Rony, Syeda Shabnam Khan, Ifti Azad Abeer, and Munir Hasan. 2022. "Structured Training as an Enabler for Women in ICT". IEEE TALE 2022. Taiwan (Accepted)',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 150); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-technology-empowerment-context-urban-afghan',
    title: 'Technology for empowerment: Context of urban Afghan women',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Mahbuba Tasmin' } },
      { customAuthor: { name: 'Sayyed Mohammad Nasim Ibrahim' } },
    ],
    year: 2022,
    status: 'published',
    type: 'journal',
    venueLabel: 'Technology in Society',
    doi: '10.1016/j.techsoc.2022.102058',
    externalUrl: 'https://doi.org/10.1016/j.techsoc.2022.102058',
    isOpenAccess: false,
    citationText:
      'Ahmed, Nova, Mahbuba Tasmin, and Sayyed Mohammad Nasim Ibrahim. "Technology for empowerment: Context of urban Afghan women." Technology in Society 70 (2022): 102058.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 168); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1016/j.techsoc.2022.102058.",
    },
  },
  {
    id: '2022-complexities-participatory-action-research-community',
    title:
      'The complexities of participatory action research: a community development project in Bangladesh',
    authors: [
      { customAuthor: { name: 'Stillman, Larry' } },
      { customAuthor: { name: 'Misita Anwar' } },
      { customAuthor: { name: 'Gillian Oliver' } },
      { customAuthor: { name: 'Viviane Frings-Hessami' } },
      { customAuthor: { name: 'Anindita Sarker' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'book-chapter',
    venueLabel:
      'Handbook on Participatory Action Research and Community Development, pp. 218-238. Edward Elgar Publishing',
    citationText:
      'Stillman, Larry, Misita Anwar, Gillian Oliver, Viviane Frings-Hessami, Anindita Sarker, and Nova Ahmed. "The complexities of participatory action research: a community development project in Bangladesh." In Handbook on Participatory Action Research and Community Development, pp. 218-238. Edward Elgar Publishing, 2022',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 178); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-role-fintech-positive-enabler-during',
    title: 'The Role of Fintech as a Positive Enabler During COVID-19 in Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Md. Sabbir Ahmed' } },
      { customAuthor: { name: 'Ifti Azad' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Tanvir Hasan' } },
      { customAuthor: { name: 'Gazi Fakhrul' } },
    ],
    year: 2022,
    status: 'published',
    type: 'journal',
    venueLabel: 'Journal of Bangladesh Studies, Vol. 24, Issue 2',
    citationText:
      'Nova Ahmed, Anik Saha, Md. Sabbir Ahmed, Ifti Azad, Anik Sinha, Rahat Jahangir Rony, Syeda Shabnam Khan, Shajnush Amir, Tanvir Hasan, Gazi Fakhrul. 2022. "The Role of Fintech as a Positive Enabler During COVID-19 in Bangladesh". Journal of Bangladesh Studies. Vol.24 Issue 2, December 2022.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 148); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-world-my-hand-now-smartphones',
    title:
      'The World is in My Hand Now: Smartphones for Empowering Rural Women in Developing Countries',
    authors: [
      { customAuthor: { name: 'Monisha Biswas' } },
      { customAuthor: { name: 'Misita Anwar' } },
      { customAuthor: { name: 'Manika Saha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Yolande Strengers' } },
      { customAuthor: { name: 'Larry Stillman' } },
      { customAuthor: { name: 'Gillian Oliver' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/3572334.3572394',
    externalUrl: 'https://doi.org/10.1145/3572334.3572394',
    isOpenAccess: true,
    abstract:
      "Smartphones are important for international development in the Global South. This paper explores how access to smartphone technologies promote women's agency for social change in these contexts by creating learning and livelihood opportunities and increasing connection with local market and service providers. The paper presents findings from a project which provided 200 Bangladeshi rural women farmers with smartphone technologies, training and support, and qualitatively investigated their ability to cope with geographic vulnerabilities, challenging market access, and social barriers. Reporting on a subset of these women's experiences, smartphone technologies helped these women gain better access to public agricultural extension and financial services, along with better acceptance from family and society. This, in turn, improved their dignity, confidence and sense of wellbeing. Insights will help ICT4D designers and development practitioners understand the importance of low-cost, bottom-up design inputs and social factors in future projects in similar developing country contexts.",
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3572334.3572394.",
    },
  },
  {
    id: '2022-understanding-healthcare-sector-bangladesh-experience',
    title:
      'Understanding the Healthcare Sector in Bangladesh: Experience and Services during the COVID-19 Pandemic',
    authors: [
      { customAuthor: { name: 'Ridwanul Haque' } },
      { customAuthor: { name: 'Md. Saif Ahammod Khan' } },
      { customAuthor: { name: 'Nasim Mahmud Mishu' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'accepted-in-press',
    type: 'conference',
    venue: 'asian-chi',
    citationText:
      'Ridwanul Haque, Md. Saif Ahammod Khan, Nasim Mahmud Mishu, Rahat Jahangir Rony and Nova Ahmed. 2022. Understanding the Healthcare Sector in Bangladesh: Experience and Services during the COVID-19 Pandemic. AsianCHI Symposium, CHI 2022. USA. (Accepted)',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 158); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-upper-limb-rehabilitation-exploring-physiotherapy',
    title:
      'Upper-limb Rehabilitation: Exploring The Physiotherapy Landscape of the UK and Bangladesh',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Nervo Verdezoto Dias' } },
      { customAuthor: { name: 'Samuelson Atiba' } },
      { customAuthor: { name: 'Valerie Sparkes' } },
      { customAuthor: { name: 'Katarzyna Stawarz' } },
    ],
    year: 2022,
    status: 'accepted-in-press',
    type: 'conference',
    venueLabel: '9th World Congress of Biomechanics 2022, Taipei',
    citationText:
      'Rahat Jahangir Rony, Nova Ahmed, Shajnush Amir, Nervo Verdezoto Dias, Samuelson Atiba, Valerie Sparkes, Katarzyna Stawarz. 2022. Upper-limb Rehabilitation: Exploring The Physiotherapy Landscape of the UK and Bangladesh. 9th World Congress of Biomechanics 2022. Taipei (Accepted)',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 154); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2022-i-use-youtube-now-covid',
    title:
      '“I Use YouTube Now in COVID”: Understanding Technology Adoption of Indigenous Communities during COVID-19 Pandemic in Bangladesh',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Shajnush Amir' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2022,
    status: 'published',
    type: 'conference',
    venue: 'compass',
    doi: '10.1145/3530190.3534847',
    externalUrl: 'https://doi.org/10.1145/3530190.3534847',
    isOpenAccess: false,
    citationText:
      'Rahat Jahangir Rony, Anik Sinha, Shajnush Amir, Syeda Shabnam Khan, Anik Saha, Ifti Azad Abeer, Nova Ahmed. 2022. “I Use YouTube Now in COVID”: Understanding Technology Adoption of Indigenous Communities during COVID-19 Pandemic in Bangladesh. ACM SIGCAS Conference on Computing and Sustainable Societies (COMPASS) 2022, Seattle, USA. doi.org/10.1145/3530190.3534847.',
    abstract:
      'Indigenous communities in Bangladesh are comparatively disadvantaged and face several barriers regarding rights. Access to technology and ICT can help indigenous communities open new economic, political, and social dimensions. The recent COVID-19 pandemic necessitated technology adoption for routine use, which is equally important for indigenous communities, but their technology adoption scenario remains unexplored in HCI research. Considering the research gap, we interviewed n=36 (Female 26 and Male 10) indigenous people from six different indigenous communities in Chattogarm and Sylhet divisions in Bangladesh. We found that they are strongly connected in communities, have independent technology access, and have no gender differences. They have a strong interest and eagerness to learn available technologies that help them in their professions, enrich their technical skills, communication, social participation, and expand the business. The study also revealed some challenges while using technology, but that did not negatively impact their usage. The study also discussed the community-centric strengths that helped them fight against the COVID-19 crisis and work for their development. This research impacts HCI literature, revealing the technology adoption scenarios of Indigenous communities in Bangladesh.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 152); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3530190.3534847.',
    },
  },
  {
    id: '2021-development-testing-low-cost-water',
    title:
      'Development and Testing of a Low-Cost Water Level Sensor and a Mobile Based Real-time Flood Warning System for the Flash Flood Prone North Eastern Part of Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Md. Sirajul Islam' } },
      { customAuthor: { name: 'Sifat Kalam' } },
      { customAuthor: { name: 'Farzana Islam' } },
      { customAuthor: { name: 'Nabila Chowdhury' } },
      { customAuthor: { name: 'Raquebul Salman Hafiz' } },
      { customAuthor: { name: 'Nazmus Sadat' } },
      { customAuthor: { name: 'Rozana Tabassum' } },
      { customAuthor: { name: 'Nazmun Nahar' } },
      { customAuthor: { name: 'Maisha Mamtaz' } },
      { customAuthor: { name: 'Shoaib Ahmed' } },
    ],
    year: 2021,
    status: 'published',
    type: 'journal',
    venueLabel: 'International Journal of Sensors, Wireless Communications and Control',
    doi: '10.2174/2210327910999200614000455',
    externalUrl: 'https://doi.org/10.2174/2210327910999200614000455',
    isOpenAccess: false,
    abstract:
      'Background: The North-Eastern part of Bangladesh suffers from frequent flash flood, causing colossal damage to life and properties, especially the vast croplands. A distributed sensing system can monitor the water level on a continuous basis to warn people near the riverbank beforehand and reduce the damage largely. However, the required communication infrastructure is not available in most of the remote rural areas in a developing country like Bangladesh. Objective: This study intends to develop a low-cost sensor-based warning system, customizing to the Bangladesh context. Method: The system utilizes a low-cost ultrasound based sensor device, a lightweight mobile phone based server, low-cost IoT sensing nodes, and a central server for continuous monitoring of river stage data along with the provision of storage and long-term data analytics. Results: A flash flood warning system developed afterward with the sensors, mobile-based server, and appropriate webbased interfaces. The device was tested for some environmental conditions in the lab and deployed it later in the outdoor conditions for short-term periods. Conclusion: Overall, the warning system performed well in the lab as well as the outdoor environment, with the ability to detect water level at reasonable accuracy and transmit data to the server in real time. Some minor shortcomings still noted with the scope for improvements, which are in the way to improve further.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2174/2210327910999200614000455.",
    },
  },
  {
    id: '2021-identifying-high-low-academic-result',
    title: 'Identifying High and Low Academic Result Holders Through Smartphone Usage Data',
    authors: [
      { customAuthor: { name: 'Md Sabbir Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2021,
    status: 'published',
    type: 'conference',
    venue: 'asian-chi',
    doi: '10.1145/3429360.3468192',
    externalUrl: 'https://doi.org/10.1145/3429360.3468192',
    isOpenAccess: false,
    citationText:
      'Ahmed, M. S., Rony, R. J., & Ahmed, N. (2021). Identifying High and Low Academic Result Holders Through Smartphone Usage Data. AsianCHI Symposium, CHI 2021. Japan. doi.org/10.1145/3429360.3468192',
    abstract:
      'Nowadays, smartphones have become an inseparable part of students’ life. Many previous studies have explored smartphone usage behavior in different contexts. However, to our best knowledge, smartphone usage behavior of the high and low academic result holders is very less studied. Thus, in the context of Bangladesh, using 7 days’ actual smartphone usage data of high [N=32] and low [N=44] performers, we investigate the smartphone usage of these two groups. Our findings show that low performers are more focused on certain apps of the Launcher category whereas high performers are more focused on certain apps of the Video category. Moreover, we find that low performers’ micro usage and review session number is statistically significantly (p<0.05) higher. Based on different smartphone usage data, our presented machine learning model classifies these two groups of students with 73.33% accuracy. Thus, these findings suggest that high and low performers can be identified through smartphone usage data.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 197, also lines 218); DOI stated in the NSU citation (not in ORCID); metadata from Crossref/OpenAlex for DOI 10.1145/3429360.3468192.',
    },
  },
  {
    id: '2021-religion-womens-intimate-health-inclusive',
    title: 'Religion and Women’s Intimate Health: Towards an Inclusive Approach to Healthcare',
    authors: [
      { customAuthor: { name: 'Mustafa, M.' } },
      { customAuthor: { name: 'Zaman, K. T.' } },
      { customAuthor: { name: 'Ahmad, T.' } },
      { customAuthor: { name: 'Batool, A.' } },
      { customAuthor: { name: 'Ghazali, M.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2021,
    status: 'published',
    type: 'conference',
    venue: 'chi',
    featured: true,
    citationText:
      'Mustafa, M., Zaman, K. T., Ahmad, T., Batool, A., Ghazali, M., & Ahmed, N. (2021, May). Religion and Women’s Intimate Health: Towards an Inclusive Approach to Healthcare. In Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems (pp. 1-13).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 193); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2021-nature-cause-consequence-covid-19',
    title: 'The nature, cause and consequence of COVID-19 panic among social media users in India',
    authors: [
      { customAuthor: { name: 'Bhattacharya, C.' } },
      { customAuthor: { name: 'Chowdhury, D.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Özgür, S.' } },
      { customAuthor: { name: 'Bhattacharya, B.' } },
      { customAuthor: { name: 'Mridha, S. K.' } },
      { customAuthor: { name: 'Bhattacharyya, M.' } },
    ],
    year: 2021,
    status: 'published',
    type: 'journal',
    venueLabel: 'Social Network Analysis and Mining, 11(1), 1-11',
    citationText:
      'Bhattacharya, C., Chowdhury, D., Ahmed, N., Özgür, S., Bhattacharya, B., Mridha, S. K., & Bhattacharyya, M. (2021). The nature, cause and consequence of COVID-19 panic among social media users in India. Social Network Analysis and Mining, 11(1), 1-11.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 199); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2021-exploration-factors-affecting-mobile-banking',
    title:
      'Towards Exploration of the Factors Affecting Mobile Banking of Bangladeshi Women during COVID',
    authors: [
      { customAuthor: { name: 'Md. Sabbir Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Syeda Shabnam Khan' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2021,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    doi: '10.2139/ssrn.4029970',
    externalUrl: 'https://doi.org/10.2139/ssrn.4029970',
    isOpenAccess: true,
    citationText:
      'Ahmed, S., Rony, R. J., Khan, S. S., Sinha, A., Saha, A., and Ahmed N. 2021. "Towards Exploration of the Factors Affecting Mobile Banking of Bangladeshi Women During COVID". Human Computer Interaction Across the Border Symposium. CHI 2021.',
    abstract:
      'The previous study finds that mobile banking can significantly contribute to reducing poverty especially in the case of women-headed households. Currently, due to the impact of the pandemic, a significant number of women are at risk of being pushed into poverty. In this study, using 20 Bangladeshi womens’ data, we statistically analyze the factors that can affect the mobile banking of Bangladeshi women. Our findings show that the women who are more educated, more engaged with technology, and more empowered, are more likely to use mobile banking. However, phone sharing with others shows a significant negative impact on it.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 205); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.2139/ssrn.4029970. DOI is the SSRN posting of this work (matched via ORCID); venue/year from the NSU citation.",
    },
  },
  {
    id: '2021-understanding-self-reported-stress-among',
    title:
      'Understanding self-reported stress among drivers and designing stress monitor using heart rate variability',
    authors: [{ customAuthor: { name: 'Ahmed, N.' } }, { customAuthor: { name: 'Rony, R. J.' } }],
    year: 2021,
    status: 'published',
    type: 'journal',
    venueLabel: 'Quality and User Experience, 6(1), 1-21',
    citationText:
      'Ahmed, N., & Rony, R. J. (2021). Understanding self-reported stress among drivers and designing stress monitor using heart rate variability.Quality and User Experience, 6(1), 1-21.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 201); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2021-understanding-education-children-autism-bangladesh',
    title:
      "Understanding the Education of Children with Autism in Bangladesh: Parents' Perspective",
    authors: [
      { customAuthor: { name: 'Hridi, A. P.' } },
      { customAuthor: { name: 'Saha, A.' } },
      { customAuthor: { name: 'Sinha, A.' } },
      { customAuthor: { name: 'Abeer, I. A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Ahmed, S.' } },
    ],
    year: 2021,
    status: 'published',
    type: 'conference',
    venue: 'cscw',
    featured: true,
    citationText:
      "Hridi, A. P., Saha, A., Sinha, A., Abeer, I. A., Ahmed, N., & Ahmed, S. (2021). Understanding the Education of Children with Autism in Bangladesh: Parents' Perspective. Proceedings of the ACM on Human-Computer Interaction, 5(CSCW1), 1-30.",
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 191); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2021-covid-has-made-everyone-digital',
    title:
      "“COVID has made Everyone Digital and Digitally Independent”: Understanding Working Women's DFS and Technology Adoption during COVID Pandemic in Bangladesh",
    authors: [
      { customAuthor: { name: 'Jahangir Rony, R.' } },
      { customAuthor: { name: 'Shabnam Khan, S.' } },
      { customAuthor: { name: 'Sinha, A.' } },
      { customAuthor: { name: 'Saha, A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2021,
    status: 'published',
    type: 'conference',
    venue: 'asian-chi',
    citationText:
      "Jahangir Rony, R., Shabnam Khan, S., Sinha, A., Saha, A., & Ahmed, N. (2021, May). “COVID has made Everyone Digital and Digitally Independent”: Understanding Working Women's DFS and Technology Adoption during COVID Pandemic in Bangladesh. In Asian CHI Symposium 2021 (pp. 202-209).",
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 195); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2021-i-didnt-understand-but-i',
    title:
      '“I didn’t understand but I was determined to learn”: Understanding the Contrast of using DFS among the Working Women in Bangladesh',
    authors: [
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Khan, S. S.' } },
      { customAuthor: { name: 'Sinha, A.' } },
      { customAuthor: { name: 'Saha, A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2021,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    citationText:
      'Rony, R. J., Khan, S. S., Sinha, A., Saha, A., and Ahmed, N. 2021. “I didn’t understand but I was determined to learn”: Understanding the Contrast of using DFS among the Working Women in Bangladesh.Human Computer Interaction Across the Border Symposium. CHI 2021.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 203); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-empirical-study-analyze-impact-instagram',
    title: "An Empirical Study to Analyze the Impact of Instagram on Students' Academic Results",
    authors: [
      { customAuthor: { name: 'Ahmed, S.' } },
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Ashhab, M.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'conference',
    venueLabel: 'IEEE TENSYMP 2020, Bangladesh',
    citationText:
      "Ahmed, S., Rony, R. J., Ashhab, M., Ahmed, N. 2020. An Empirical Study to Analyze the Impact of Instagram on Students' Academic Results. IEEE TENSYMP 2020. Bangladesh.",
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 238); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-analysis-morphological-changes-river-padma',
    title:
      'Analysis of the Morphological Changes of the River Padma Along Naria Upazila through Supervised Classification of Satellite Images',
    authors: [
      { customAuthor: { name: 'Titlee, R.' } },
      { customAuthor: { name: 'Islam, M. S.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2020,
    status: 'published',
    citationText:
      'Titlee, R., Islam, M. S., & Ahmed, N. Analysis of the Morphological Changes of the River Padma Along Naria Upazila through Supervised Classification of Satellite Images.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 216); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-challenges-opportunities-young-female-learners',
    title:
      'Challenges and Opportunities for Young Female Learners in STEM from the Perspective of Bangladesh',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Urmi, T.' } },
      { customAuthor: { name: 'Tasmin, M.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'conference',
    venue: 'ieee-tale',
    citationText:
      'Ahmed, N., Urmi, T., & Tasmin, M. (2020, December). Challenges and Opportunities for Young Female Learners in STEM from the Perspective of Bangladesh. In 2020 IEEE International Conference on Teaching, Assessment, and Learning for Engineering (TALE) (pp. 39-46). IEEE.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 212); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-design-thinking-around-covid-19',
    title: 'Design thinking around COVID-19: Focusing on the garment workers of Bangladesh',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Rony, R.J.' } },
      { customAuthor: { name: 'Zaman, K.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'journal',
    venue: 'interactions',
    citationText:
      'Ahmed, N., Rony, R.J., and Zaman, K. 2020. Design thinking around COVID-19: Focusing on the garment workers of Bangladesh. ACM Interaction.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 236); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-designing-digital-payments-next-billion',
    title: 'Designing Digital Payments for Next Billion Users',
    authors: [
      { customAuthor: { name: 'Jain, P.' } },
      { customAuthor: { name: 'Ibtasam, S.' } },
      { customAuthor: { name: 'Balkrishan, D. K.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Jones, M.' } },
      { customAuthor: { name: 'Shahid, S.' } },
      { customAuthor: { name: '...' } },
      { customAuthor: { name: 'Joshi, A.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    citationText:
      'Jain, P., Ibtasam, S., Balkrishan, D. K., Ahmed, N., Jones, M., Shahid, S., ... & Joshi, A. (2020, April). Designing Digital Payments for Next Billion Users. In Extended Abstracts of the 2020 CHI Conference on Human Factors in Computing Systems (pp. 1-4).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 222); fields parsed from the citation text, no DOI or API match. Author list is truncated ("...") in the source.',
    },
  },
  {
    id: '2020-development-low-cost-wearable-mobile',
    title:
      'Development of a Low Cost Wearable with Mobile Sensing to Monitor Driving Stress through HRV',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2020,
    status: 'published',
    type: 'conference',
    venue: 'asian-chi',
    doi: '10.1145/3391203.3391213',
    externalUrl: 'https://doi.org/10.1145/3391203.3391213',
    isOpenAccess: false,
    citationText:
      'Rony, R. J., Ahmed, N. (2020). Development of a Low-Cost Wearable with Mobile Sensing to Monitor Driving Stress using HRV. Asian CHI 2020 Symposium. doi.org/10.1145/3391203.3391213',
    abstract:
      'Stress is a mental state that is responsible for changing human behavior. Driving stress is harmful because it may cause road accidents. In developing countries, the rate of road accidents is higher where driving stress is responsible very often. Today monitoring any stress by using wearable is a growing research area, but most of the commercially available wearables are expensive. Only a few wearables are developed to get specifically the driving stress in developed nations. We gradually develop a low cost wearable associated with a mobile sensing application to detect the driving stress along with road conditions by analyzing HRV (Heart Rate Variability) in developing country context to support the low-income community.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 228); DOI stated in the NSU citation (not in ORCID); metadata from Crossref/OpenAlex for DOI 10.1145/3391203.3391213.',
    },
  },
  {
    id: '2020-exploring-how-international-graduate-students',
    title: 'Exploring How International Graduate Students in the US Seek Support',
    authors: [
      { customAuthor: { name: 'Motahar, T.' } },
      { customAuthor: { name: 'Jasim, M.' } },
      { customAuthor: { name: 'Ahmed, S. I.' } },
      { customAuthor: { name: 'Mahyar, N.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    citationText:
      'Motahar, T., Jasim, M., Ahmed, S. I., & Mahyar, N. (2020, April). Exploring How International Graduate Students in the US Seek Support. In Extended Abstracts of the 2020 CHI Conference on Human Factors in Computing Systems (pp. 1-8).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 240); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-kotha-bondhu-translating-sign-languages',
    title: 'Kotha Bondhu: Translating Sign Languages into Bengali Voice',
    authors: [
      { customAuthor: { name: 'Mahabub Hossain' } },
      { customAuthor: { name: 'Abdullah Mahmood' } },
      { customAuthor: { name: 'Md. Rajoan Rahman' } },
      { customAuthor: { name: 'Sohanur Rahman' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2020,
    status: 'published',
    type: 'conference',
    venue: 'asian-chi',
    doi: '10.1145/3391203.3391208',
    externalUrl: 'https://doi.org/10.1145/3391203.3391208',
    isOpenAccess: false,
    citationText:
      'M. H., Mahmood, A., Rahman, R., Rahman, S., Rony, R. J., Ahmed, N. (2020). Kotha Bondhu: Translating Sign Languages into Bengali Voice. Asian CHI 2020 Symposium. doi.org/10.1145/3391203.3391208',
    abstract:
      'Sign languages are the only communication medium for mute and deaf people all over the world, but all the general people are not familiar with it. It is really tough for these people to make other people understand their voices. In the context of Bangladesh, we have studied these community people specifically from the Tablighi Jamaat community who use different sign language to communicate with people. By studying them we have gathered the local signs along with global standard sign languages in an application named Kotha Bondhu. It is a very simpler application that is understandable to any community people and is able to translate the sign languages into Bengali voice.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 232); DOI stated in the NSU citation (not in ORCID); metadata from Crossref/OpenAlex for DOI 10.1145/3391203.3391208.',
    },
  },
  {
    id: '2020-mom-thinks-technology-my-enemy',
    title: 'Mom thinks, Technology is my Enemy: A Teen Perspective',
    authors: [
      { customAuthor: { name: 'Anuva C.' } },
      { customAuthor: { name: 'Arisha C.' } },
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Bhuiyan, M.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    citationText:
      'Anuva C., Arisha C., Rony, R. J., Ahmed, N., Bhuiyan, M.. 2020. Mom thinks, Technology is my Enemy: A Teen Perspective. CHI 2020 HCIxB Symposium.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 234); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-motherhood-science-how-children-change',
    title: 'Motherhood in Science–How children change our academic careers',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Amin, A.' } },
      { customAuthor: { name: 'Arya, S. S.' } },
      { customAuthor: { name: 'Balela, M. D.' } },
      { customAuthor: { name: 'Bassioni, G.' } },
      { customAuthor: { name: 'Pires, F. F.' } },
      { customAuthor: { name: '...' } },
      { customAuthor: { name: 'Eresso, M. Z.' } },
    ],
    year: 2020,
    status: 'published',
    citationText:
      'Ahmed, N., Amin, A., Arya, S. S., Balela, M. D., Bassioni, G., Pires, F. F., ... & Eresso, M. Z. (2020). Motherhood in Science–How children change our academic careers.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 214); fields parsed from the citation text, no DOI or API match. Author list is truncated ("...") in the source.',
    },
  },
  {
    id: '2020-social-distancing-challenges-marginal-communities',
    title:
      'Social Distancing Challenges for Marginal Communities during COVID-19 Pandemic in Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Kimia Tuz Zaman' } },
    ],
    year: 2020,
    status: 'published',
    type: 'journal',
    venueLabel: 'Journal of Biomedical Analytics',
    doi: '10.30577/jba.v3i2.45',
    externalUrl: 'https://doi.org/10.30577/jba.v3i2.45',
    isOpenAccess: true,
    citationText:
      'Ahmed, N., Rony, R. J., & Zaman, K. T. (2020). Social Distancing Challenges for Marginal Communities during COVID-19 Pandemic in Bangladesh. Journal of Biomedical Analytics, 3(2), 5-14.',
    abstract:
      'This study presents the challenges of marginal communities in maintaining social distances during the COVID-19 pandemic. We focused on garment worker communities in Bangladesh. The current living conditions put the community at high risk due to the contagious nature of COVID-19. The study involved 55 garment workers (32 female) living in three different regions--Ashulia, Gazipur, and Mirpur of Bangladesh. Through a qualitative research method, three critical aspects were studied. First, the inability to maintain social distancing in the community living in close proximity. Second, there is a lack of concern about healthcare among the community and, finally, the absence of preparation for crisis management. The research work proposes policy level intervention for better healthcare in the light of the pandemic that can be helpful in the coming days.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 220); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.30577/jba.v3i2.45.",
    },
  },
  {
    id: '2020-effectiveness-acceptance-collaborative-e-learning',
    title:
      'The Effectiveness and Acceptance of Collaborative E-learning in the Context of Bangladesh',
    authors: [
      { customAuthor: { name: 'Progga, F. T.' } },
      { customAuthor: { name: 'Shahria, M. T.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'conference',
    venue: 'ieee-tale',
    citationText:
      'Progga, F. T., Shahria, M. T., & Ahmed, N. (2020, December). The Effectiveness and Acceptance of Collaborative E-learning in the Context of Bangladesh. In 2020 IEEE International Conference on Teaching, Assessment, and Learning for Engineering (TALE) (pp. 554-558). IEEE.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 210); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-understanding-teens-online-awareness-knowledge',
    title:
      'Understanding Teens Online Awareness and Knowledge Regarding Cybersecurity in Bangladesh',
    authors: [
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Costa, P. A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2020,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    citationText:
      'Rony, R. J., Costa, P. A., Ahmed, N. (2020).. 2020. Understanding Teens Online Awareness and Knowledge Regarding Cybersecurity in Bangladesh. CHI 2020 HCIxB Symposium.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 230); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2020-understanding-educational-landscape-children-autism',
    title: 'Understanding the Educational Landscape of Children with Autism in Bangladesh',
    authors: [
      { customAuthor: { name: 'Hridi, Anurata Prabha' } },
      { customAuthor: { name: 'Shameem Ahmed' } },
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Mohammad Sorowar Hossain' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Moushumi Sharmin' } },
    ],
    year: 2020,
    status: 'published',
    type: 'conference',
    venueLabel:
      'International Conference on Information (iConference 2020), pp. 441-455. Springer, Cham',
    citationText:
      'Hridi, Anurata Prabha, Shameem Ahmed, Ifti Azad Abeer, Anik Saha, Anik Sinha, Mohammad Sorowar Hossain, Nova Ahmed, and Moushumi Sharmin. Understanding the Educational Landscape of Children with Autism in Bangladesh. In International Conference on Information, pp. 441-455. Springer, Cham, 2020.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 224); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-they-dont-leave-us-alone',
    title: '"They Don\'t Leave Us Alone Anywhere We Go": Gender and Digital Abuse in South Asia',
    authors: [
      { customAuthor: { name: 'Nithya Sambasivan' } },
      { customAuthor: { name: 'Amna Batool' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Tara Matthews' } },
      { customAuthor: { name: 'Kurt Thomas' } },
      { customAuthor: { name: 'Laura Sanely Gaytán-Lugo' } },
      { customAuthor: { name: 'David Nemer' } },
      { customAuthor: { name: 'Elie Bursztein' } },
      { customAuthor: { name: 'Elizabeth Churchill' } },
      { customAuthor: { name: 'Sunny Consolvo' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venue: 'chi',
    doi: '10.1145/3290605.3300232',
    externalUrl: 'https://doi.org/10.1145/3290605.3300232',
    isOpenAccess: true,
    featured: true,
    citationText:
      'Sambasivan, N., Batool, A., Ahmed, N., Matthews, T., Thomas, K., Gaytán-Lugo, L.S., Nemer, D., Bursztein, E., Churchill, E. and Consolvo, S., 2019, May. They Don\'t Leave Us Alone Anywhere We Go" Gender and Digital Abuse in South Asia. In proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (pp. 1-14). (Best of CHI 2019)',
    abstract:
      "South Asia faces one of the largest gender gaps online globally, and online safety is one of the main barriers to gender-equitable Internet access [GSMA, 2015]. To better understand the gendered risks and coping practices online in South Asia, we present a qualitative study of the online abuse experiences and coping practices of 199 people who identified as women and 6 NGO staff from India, Pakistan, and Bangladesh, using a feminist analysis. We found that a majority of our participants regularly contended with online abuse, experiencing three major abuse types: cyberstalking, impersonation, and personal content leakages. Consequences of abuse included emotional harm, reputation damage, and physical and sexual violence. Participants coped through informal channels rather than through technological protections or law enforcement. Altogether, our findings point to opportunities for designs, policies, and algorithms to improve women's safety online in South Asia.",
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 245); title-matched to Nova Ahmed\'s ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3290605.3300232. Citation notes "Best of CHI 2019".',
    },
  },
  {
    id: '2019-low-cost-healthcare-bot-elderly',
    title: 'A Low-cost Healthcare Bot for Elderly People',
    authors: [
      { customAuthor: { name: 'Dibya Prokash Sarkar' } },
      { customAuthor: { name: 'Md. Fahim Farden' } },
      { customAuthor: { name: 'Md. Atiqul Islam' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Tamanna Motahar' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venue: 'iciev',
    doi: '10.1109/iciev.2019.8858567',
    externalUrl: 'https://doi.org/10.1109/iciev.2019.8858567',
    isOpenAccess: false,
    citationText:
      'Sarkar, D. P., Farden, F., Islam, A., Rony, R. J., and Motahar, T. (2019). A Low-cost Healthcare Bot for Elderly People. IEEE8th International Conference on Informatics, Electronics & Vision (ICIEV) 2019. DOI: 10.1109/ICIEV.2019.8858567',
    abstract:
      'Modern days are not so comfortable for the elderly people compare to young people, because naturally they are passing a lonely day for a longer period of time. Elderly and physically weak people would like to lead an independent and quality life in their everyday lonely period, and some physical or mental support may help to improve their lifestyle. Today young people cannot give proper attention to them for their own engagements and that has a massive impact to the healthcare of the elderly people. Healthcare is considered as an important issue all over the world, and developed countries always try to ensure better healthcare support to the civilians in different ways, whereas South Asian developing countries do not pay much attention to this aspect. There exist some multi-purpose robots, which are developed to assist elderly people, but the cost is significantly higher that people from developing countries cannot afford this. From this perspective, to support their healthcare, we are thinking of similar kind of low cost solution. This paper deals with the development of a mini healthcare bot which is able to assist the elderly people to take medicines as per to their schedule. This bot was initially built only for research purpose and now we can consider it as full functioning robot.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 271); DOI stated in the NSU citation (not in ORCID); metadata from Crossref/OpenAlex for DOI 10.1109/iciev.2019.8858567.',
    },
  },
  {
    id: '2019-am-i-safe-looking-personal',
    title: 'AM I Safe? Looking at Personal Data Privacy in Bangladesh',
    authors: [{ customAuthor: { name: 'Rony, R. J.' } }, { customAuthor: { name: 'Ahmed, N.' } }],
    year: 2019,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    citationText:
      'Rony, R. J., Ahmed, N. (2019). AM I Safe? Looking at Personal Data Privacy in Bangladesh. CHI HCIxB Symposium.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 265); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-ambient-intelligence-systems-support-wellbeing',
    title: 'Ambient Intelligence in Systems to Support Wellbeing of Drivers',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Rony, R.J.' } },
      { customAuthor: { name: 'Mushfique, M.T.' } },
      { customAuthor: { name: 'Rahman, M.M.' } },
      { customAuthor: { name: 'Tahsin, N.E.S.' } },
      { customAuthor: { name: 'Azad, S.' } },
      { customAuthor: { name: 'Raiyan, S.' } },
      { customAuthor: { name: 'Al Hasan, S.' } },
      { customAuthor: { name: 'Khan, S.S.' } },
      { customAuthor: { name: 'D’Costa, P.A.' } },
      { customAuthor: { name: 'Rahman, S.A.U.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'book-chapter',
    venueLabel:
      'Guide to Ambient Intelligence in the IoT Environment (pp. 217-247). Springer, Cham',
    citationText:
      'Ahmed, N., Rony, R.J., Mushfique, M.T., Rahman, M.M., Tahsin, N.E.S., Azad, S., Raiyan, S., Al Hasan, S., Khan, S.S., D’Costa, P.A. and Rahman, S.A.U., 2019. Ambient Intelligence in Systems to Support Wellbeing of Drivers. In Guide to Ambient Intelligence in the IoT Environment (pp. 217-247). Springer, Cham.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 251); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-cooperative-deployment-shonabondhu',
    title: 'Cooperative deployment of Shonabondhu',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Zaman, K. T.' } },
      { customAuthor: { name: 'Islam, F.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venue: 'asian-chi',
    citationText:
      'Ahmed, N., Zaman, K. T., & Islam, F. (2019, May). Cooperative deployment of Shonabondhu. In Proceedings of Asian CHI Symposium 2019: Emerging HCI Research Collection (pp. 128-135).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 277); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-development-digital-family-stories-bangladesh',
    title: 'Development through digital family stories in Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Farlina Barik' } },
      { customAuthor: { name: 'Zareen Tasnim' } },
      { customAuthor: { name: 'Jasmine Jones' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/3287098.3287136',
    externalUrl: 'https://doi.org/10.1145/3287098.3287136',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Barik, F., Tasnim, Z., & Jones, J. (2019, January). Development through digital family stories in Bangladesh. In Proceedings of the Tenth International Conference on Information and Communication Technologies and Development (pp. 1-5).',
    abstract:
      'Bangladesh has a rich history of storytelling for cultural, historical, social, and personal memories. Family stories in particular are powerful ways to reflect on relationships along with social values in a particular snapshot of time. Our goal is to derive insights for the design of culturally and value-sensitive digital storytelling tools for families in Bangladesh to preserve and share their stories. This paper describes ongoing work to understand the kinds of stories people tell, as well as the experience of listening to recorded stories.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 283); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3287098.3287136.",
    },
  },
  {
    id: '2019-digital-silence-liberating-stories-during',
    title: 'Digital Silence and Liberating Stories: During a Student-Driven Movement',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Zareen Tasnim' } },
      { customAuthor: { name: 'Jasmine Jones' } },
    ],
    year: 2019,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3290607.3310418',
    externalUrl: 'https://doi.org/10.1145/3290607.3310418',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Tasnim, Z., & Jones, J. (2019, May). Digital Silence and Liberating Stories: During a Student-Driven Movement. In Extended Abstracts of the 2019 CHI Conference on Human Factors in Computing Systems (pp. 1-10).',
    abstract:
      'In August 2018, a student protest initiated in Bangladesh sought justice when two school students were run over by public bus. Student protesters were demonstrating on the street for days until they were physically attacked. Concurrent with the physical attacks, the country experienced a disconnect. Internet, restrictions on social media usage, and several high-profile arrests of people speaking about the incidents. These suppressive encounters created what we call a "digital silence." In response, we collected stories from people, which depict their effort to seek out information about the events unfolding and share their perspective of what happened. Through these in-the-moment stories, we see a glimpse of how the information suppression impacted people with varying proximity to the events, including protesters, bystanders, and family members. We also reflect on the benefit of the subtle defiance of storytelling for storytellers in the midst of this social justice effort.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 279); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3290607.3310418.",
    },
  },
  {
    id: '2019-exploring-challenges-solution-approaches-regarding',
    title:
      'Exploring Challenges and Solution Approaches Regarding Wellbeing of Female Rohingya Community in Bangladesh',
    authors: [
      { customAuthor: { name: 'Zaman, K. T.' } },
      { customAuthor: { name: 'Hasan, W. U.' } },
      { customAuthor: { name: 'Bazlul, L.' } },
      { customAuthor: { name: 'Motahar, T.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venueLabel: 'TENCON 2019-2019 IEEE Region 10 Conference (TENCON) (pp. 361-366). IEEE',
    citationText:
      'Zaman, K. T., Hasan, W. U., Bazlul, L., Motahar, T., & Ahmed, N. (2019, October). Exploring Challenges and Solution Approaches Regarding Wellbeing of Female Rohingya Community in Bangladesh. In TENCON 2019-2019 IEEE Region 10 Conference (TENCON) (pp. 361-366). IEEE.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 261); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-hci-across-borders-intersections',
    title: 'HCI Across Borders and Intersections',
    authors: [
      { customAuthor: { name: 'Neha Kumar' } },
      { customAuthor: { name: 'Christian Sturm' } },
      { customAuthor: { name: 'Syed Ishtiaque Ahmed' } },
      { customAuthor: { name: 'Naveena Karusala' } },
      { customAuthor: { name: 'Marisol Wong-Villacres' } },
      { customAuthor: { name: 'Leonel Morales' } },
      { customAuthor: { name: 'Rita Orji' } },
      { customAuthor: { name: 'Michaelanne Dye' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Laura S. Gaytán-Lugo' } },
      { customAuthor: { name: 'Aditya Vashistha' } },
      { customAuthor: { name: 'David Nemer' } },
      { customAuthor: { name: 'Kurtis Heimerl' } },
      { customAuthor: { name: 'Susan Dray' } },
    ],
    year: 2019,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3290607.3299004',
    externalUrl: 'https://doi.org/10.1145/3290607.3299004',
    isOpenAccess: false,
    abstract:
      'The HCI Across Borders (HCIxB) community has been growing in recent years, thanks in particular to the Development Consortium at CHI 2016 and the HCIxB Symposia at CHI 2017 and 2018. This year, we propose an HCIxB symposium that continues to build scholarship potential of early career HCIxB researchers, strengthening ties between more and less experienced members of the community. We especially invite scholarship with a focus on intersections, examining and/or addressing multiple forms of marginalization (e.g. race, gender, class, among others).',
    provenance: {
      source: 'orcid',
      sourceNote:
        "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3290607.3299004.",
    },
  },
  {
    id: '2019-managing-autism-spectrum-disorder-developing',
    title:
      'Managing autism spectrum disorder in developing countries by utilizing existing resources: A perspective from Bangladesh',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Enayetur Raheem' } },
      { customAuthor: { name: 'Nusrat Rahman' } },
      { customAuthor: { name: 'Muhammad Zillur Rahman Khan' } },
      { customAuthor: { name: 'Abdullah Al Mosabbir' } },
      { customAuthor: { name: 'Mohammad Sorowar Hossain' } },
    ],
    year: 2019,
    status: 'published',
    type: 'journal',
    venueLabel: 'Autism',
    doi: '10.1177/1362361318773981',
    externalUrl: 'https://doi.org/10.1177/1362361318773981',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Raheem, E., Rahman, N., Khan, M. Z. R., Mosabbir, A. A., & Hossain, M. S. (2019). Managing autism spectrum disorder in developing countries by utilizing existing resources: A perspective from Bangladesh.Autism, 23(3), 801-803.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 249); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1177/1362361318773981.",
    },
  },
  {
    id: '2019-mathealthxb-designing-across-borders-global',
    title: 'MatHealthXB: Designing Across Borders for Global Maternal Health',
    authors: [
      { customAuthor: { name: 'Prabhakar, A. S.' } },
      { customAuthor: { name: 'Newhouse, N.' } },
      { customAuthor: { name: 'Simpson, E.' } },
      { customAuthor: { name: 'Mburu, C. W.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Chen, Y.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    citationText:
      'Prabhakar, A. S., Newhouse, N., Simpson, E., Mburu, C. W., Ahmed, N., & Chen, Y. (2019, May). MatHealthXB: Designing Across Borders for Global Maternal Health. In Extended Abstracts of the 2019 CHI Conference on Human Factors in Computing Systems (pp. 1-4).',
    provenance: {
      source: 'orcid',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 281); title-matched to Nova Ahmed\'s ORCID (no DOI there), so title/year from ORCID and authors/venue parsed from the citation. ORCID lists DOI 10.1145/3290607.3308454 for this work, but Crossref resolves that DOI to a different paper ("Designing Compassion Cultivating Interactions for New Mothers"), so no DOI is attached.',
    },
  },
  {
    id: '2019-monitoring-driving-stress-hrv',
    title: 'Monitoring Driving Stress using HRV',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venue: 'comsnets',
    doi: '10.1109/comsnets.2019.8711411',
    externalUrl: 'https://doi.org/10.1109/comsnets.2019.8711411',
    isOpenAccess: false,
    citationText:
      'Rony, R. J., & Ahmed, N. 2019. Monitoring Driving Stress using HRV. IEEE 11th International Conference on COMmunication Systems & NETworkS 2019 (COMSNETS). DOI: 10.1109/COMSNETS.2019.8711411(Best Poster COMSNETS 2019)',
    abstract:
      'Driving stress is responsible for bad driving behavior and fatal accidents. This stress initiates from road factors and keeps negative consequences in overall traffic management as well as in transportation system. Bangladesh has poor road infrastructure, environment and management. We explore to know the Bangladeshi drivers stress level through HRV by developing a system. This system helps the drivers to manage their stress by creating self-awareness among the drivers regarding overall road safety.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 247); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1109/comsnets.2019.8711411. Citation notes "Best Poster COMSNETS 2019".',
    },
  },
  {
    id: '2019-motorbike-ridesharing-bangladesh-way-empowerment',
    title: 'Motorbike Ridesharing in Bangladesh: The Way of Empowerment',
    authors: [
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Islam, G. F.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    citationText:
      'Rony, R. J., Islam, G. F., Ahmed, N. (2019). Motorbike Ridesharing in Bangladesh: The Way of Empowerment. CHI HCIxB Symposium.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 269); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-protibadi-starting-fight-against-sexual',
    title: 'Protibadi: starting the fight against sexual abuse',
    authors: [{ customAuthor: { name: 'Ahmed, N.' } }],
    year: 2019,
    status: 'published',
    type: 'journal',
    venueLabel: 'XRDS: Crossroads, The ACM Magazine for Students, 26(2), 40-43',
    citationText:
      'Ahmed, N. (2019). Protibadi: starting the fight against sexual abuse. XRDS: Crossroads, The ACM Magazine for Students, 26(2), 40-43.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 257); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-sheba-low-cost-assistive-robot',
    title: 'SHEBA: A Low-Cost Assistive Robot for Older Adults in the Developing World',
    authors: [
      { customAuthor: { name: 'Motahar, T.' } },
      { customAuthor: { name: 'Farden, M. F.' } },
      { customAuthor: { name: 'Sarkar, D. P.' } },
      { customAuthor: { name: 'Islam, M. A.' } },
      { customAuthor: { name: 'Cabrera, M. E.' } },
      { customAuthor: { name: 'Cakmak, M.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venueLabel:
      '2019 28th IEEE International Conference on Robot and Human Interactive Communication (RO-MAN) (pp. 1-8). IEEE',
    citationText:
      'Motahar, T., Farden, M. F., Sarkar, D. P., Islam, M. A., Cabrera, M. E., & Cakmak, M. (2019, October). SHEBA: A Low-Cost Assistive Robot for Older Adults in the Developing World. In 2019 28th IEEE International Conference on Robot and Human Interactive Communication (RO-MAN) (pp. 1-8). IEEE.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 285); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-smart-school-bus-ensuring-safety',
    title: 'Smart School Bus: Ensuring Safety On The Road For School Going Children',
    authors: [
      { customAuthor: { name: 'Sojol, J. I.' } },
      { customAuthor: { name: 'Alam, M. S.' } },
      { customAuthor: { name: 'Hossain, N.' } },
      { customAuthor: { name: 'Motahar, T.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venueLabel:
      '2019 21st International Conference on Advanced Communication Technology (ICACT) (pp. 734-739). IEEE',
    citationText:
      'Sojol, J. I., Alam, M. S., Hossain, N., & Motahar, T. (2019, February). Smart School Bus: Ensuring Safety On The Road For School Going Children. In 2019 21st International Conference on Advanced Communication Technology (ICACT) (pp. 734-739). IEEE.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 289); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-smart-warehouse-management-system-rfid',
    title: 'Smart Warehouse Management System with RFID and Cloud Database',
    authors: [
      { customAuthor: { name: 'Rashid, M.' } },
      { customAuthor: { name: 'Ahad, S. A.' } },
      { customAuthor: { name: 'Siddique, S.' } },
      { customAuthor: { name: 'Motahar, T.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venue: 'iciev',
    citationText:
      'Rashid, M., Ahad, S. A., Siddique, S., & Motahar, T. (2019, May). Smart Warehouse Management System with RFID and Cloud Database. In 2019 Joint 8th International Conference on Informatics, Electronics & Vision (ICIEV) and 2019 3rd International Conference on Imaging, Vision & Pattern Recognition (icIVPR) (pp. 218-222). IEEE.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 287); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-stress-personality-study-drivers-bangladesh',
    title: 'Stress and Personality Study on Drivers of Bangladesh',
    authors: [
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Chakma, R.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    citationText:
      'Rony, R. J., Chakma, R., Ahmed, N. (2019). Stress and Personality Study on Drivers of Bangladesh. CHI HCIxB Symposium.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 267); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-sustainable-houses-bangladesh',
    title: 'Sustainable Houses of Bangladesh',
    authors: [
      { customAuthor: { name: 'Nowfel, A. A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Rony, R. J.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'conference',
    venueLabel: 'ICSNBE 2019',
    citationText:
      'Nowfel, A. A., Ahmed, N., Rony, R. J. (2019). Sustainable Houses of Bangladesh. ICSNBE 2019.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 273); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-gender-equitable-privacy-security-south',
    title: 'Toward Gender-Equitable Privacy and Security in South Asia',
    authors: [
      { customAuthor: { name: 'Nithya Sambasivan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Amna Batool' } },
      { customAuthor: { name: 'Elie Bursztein' } },
      { customAuthor: { name: 'Elizabeth Churchill' } },
      { customAuthor: { name: 'Laura Sanely Gaytan-Lugo' } },
      { customAuthor: { name: 'Tara Matthews' } },
      { customAuthor: { name: 'David Nemar' } },
      { customAuthor: { name: 'Kurt Thomas' } },
      { customAuthor: { name: 'Sunny Consolvo' } },
    ],
    year: 2019,
    status: 'published',
    type: 'journal',
    venueLabel: 'IEEE Security & Privacy',
    doi: '10.1109/msec.2019.2912727',
    externalUrl: 'https://doi.org/10.1109/msec.2019.2912727',
    isOpenAccess: false,
    citationText:
      'Sambasivan, N., Ahmed, N., Batool, A., Bursztein, E., Churchill, E., Gaytan-Lugo, L. S., & Consolvo, S. (2019). Toward Gender-Equitable Privacy and Security in South Asia. IEEE Security & Privacy, 17(4), 71-77.',
    abstract:
      "South Asia has one of the world's largest populations—India, Pakistan, and Bangladesh alone are home to more than 20% of all people. The region is also one of the fastest-growing technology markets as a result of its increased infrastructure and growing affordability. Despite this progress, South Asia faces one of the largest online gender disparities in the world, i.e., women are 58% less likely to connect to the mobile Internet than men.1 We believe that, as the Internet becomes more globally accessible, it is imperative for technologists to intentionally examine the biases and inequities perpetuated in technology to truly enable gender equity online.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 275, also lines 255); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/msec.2019.2912727. Line 255 lists the same title with a different author order and no venue; merged here.",
    },
  },
  {
    id: '2019-understanding-drivers-wellbeing-quantitative-study',
    title: 'Understanding drivers wellbeing: quantitative study analysis and wearable experiment',
    authors: [
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2019,
    status: 'published',
    type: 'extended-abstract',
    venue: 'ubicomp',
    doi: '10.1145/3341162.3344830',
    externalUrl: 'https://doi.org/10.1145/3341162.3344830',
    isOpenAccess: false,
    citationText:
      'Rony, R. J., & Ahmed, N. (2019, September). Understanding drivers wellbeing: quantitative study analysis and wearable experiment. In Adjunct Proceedings of the 2019 ACM International Joint Conference on Pervasive and Ubiquitous Computing and Proceedings of the 2019 ACM International Symposium on Wearable Computers (pp. 1170-1173).',
    abstract:
      "Driver's wellbeing has a positive impact on driving behavior and experience. Another way, driver's wellbeing depends on their daily lifestyle, demography, traffic and road conditions. Poor conditions in such factors are responsible for low wellbeing. These factors also initiate driving stress. A simple technology approach can play an important role to monitor driver's wellbeing, and help to provide better ways of increasing self-awareness regarding wellbeing. Here, we conducted a quantitative study on 88 drivers, and finally present a low cost wearable approach to support the drivers in the context of Bangladesh for better wellbeing.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 263); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3341162.3344830.",
    },
  },
  {
    id: '2019-understanding-political-ecology-forced-migration',
    title:
      'Understanding the political ecology of forced migration and deforestation through a multi-algorithm classification approach: the case of Rohingya displacement in the southeastern border region of Bangladesh',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Islam, M. N.' } },
      { customAuthor: { name: 'Hasan, M. F.' } },
      { customAuthor: { name: 'Motahar, T.' } },
      { customAuthor: { name: 'Sujauddin, M.' } },
    ],
    year: 2019,
    status: 'published',
    type: 'journal',
    venueLabel: 'Geology, Ecology, and Landscapes, 3(4), 282-294',
    citationText:
      'Ahmed, N., Islam, M. N., Hasan, M. F., Motahar, T., & Sujauddin, M. (2019). Understanding the political ecology of forced migration and deforestation through a multi-algorithm classification approach: the case of Rohingya displacement in the southeastern border region of Bangladesh. Geology, Ecology, and Landscapes, 3(4), 282-294.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 259); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2019-gender-shouldnt-matter-because-we',
    title:
      '‘Gender shouldn’t matter because we are all scientists here’: A narration of the panel discussion at the 2nd International Women in Science Without Borders conference',
    authors: [
      { customAuthor: { name: 'Antoinique Van Staden' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Yoseph Getachew' } },
      { customAuthor: { name: 'Irvy M.A. Gledhill' } },
      { customAuthor: { name: 'Maria Kanjere' } },
      { customAuthor: { name: 'Sibusisiwe Khuluse-Makhanya' } },
      { customAuthor: { name: 'Sonali Das' } },
    ],
    year: 2019,
    status: 'published',
    type: 'journal',
    venueLabel: 'South African Journal of Science',
    doi: '10.17159/sajs.2019/5865',
    externalUrl: 'https://doi.org/10.17159/sajs.2019/5865',
    isOpenAccess: true,
    citationText:
      "Van Staden, A., Ahmed, N., Getachew, Y., Gledhill, I., Kanjere, M., Khuluse-Makhanya, S., & Das, S. (2019). 'Gender shouldn't matter because we are all scientists here': A narration of the panel discussion. 2nd International Women in Science Without Borders conference. South African Journal of Science, 115(3-4), 1-4.",
    abstract:
      'The disparities that exist between men and women, and more so working mothers, in the participation of science, \\ntechnology, engineering, mathematics, medicine and innovation (STEMMI) are a global concern.2 In the past, \\nefforts to address gender inequalities in STEMMI progressed at a slower pace because of the fragmented nature of \\ngender equality advocacy efforts. In explicitly defining gender equality as a goal for sustainable development (SDG \\n5), there is renewed vigour in the pursuit of solutions to address discrimination on the basis of gender.3 Challenges \\nthat constrain women’s full participation in political, economic and public life are being identified, and as a result \\npolicies and strategies, including those concerning women in STEMMI in developing countries like South Africa, \\nare being reviewed to ensure that the gender gap is reduced.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 253); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.17159/sajs.2019/5865.",
    },
  },
  {
    id: '2018-applying-text-mining-protest-stories',
    title: 'Applying Text Mining to Protest Stories as Voice against Media Censorship',
    authors: [
      { customAuthor: { name: 'Mayeesha, T.' } },
      { customAuthor: { name: 'Tasneem, Z.' } },
      { customAuthor: { name: 'Jones, J.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2018,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'arXiv',
    externalUrl: 'https://arxiv.org/abs/1812.11430',
    citationText:
      'Mayeesha, T., Tasneem, Z., Jones, J., & Ahmed, N. (2018). Applying Text Mining to Protest Stories as Voice against Media Censorship.arXiv preprint arXiv:1812.11430.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 306); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-automated-mobile-robot-rfid-scanner',
    title: 'Automated mobile robot with RFID scanner and self obstacle avoiding system',
    authors: [
      { customAuthor: { name: 'Neloy, A. A.' } },
      { customAuthor: { name: 'Arman, A.' } },
      { customAuthor: { name: 'Islam, M. S.' } },
      { customAuthor: { name: 'Motahar, T.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'journal',
    venueLabel: 'International Journal of Pure and Applied Mathematics, 118(18), 3139-3150',
    citationText:
      'Neloy, A. A., Arman, A., Islam, M. S., & Motahar, T. (2018). Automated mobile robot with RFID scanner and self obstacle avoiding system.International Journal of Pure and Applied Mathematics, 118(18), 3139-3150.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 332); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-bengali-communicative-android-app-autism',
    title: 'Bengali Communicative Android App for Autism Personnel',
    authors: [
      { customAuthor: { name: 'Abeer, I. A.' } },
      { customAuthor: { name: 'Saha, A.' } },
      { customAuthor: { name: 'Sinha, A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'comsnets',
    citationText:
      'Abeer, I. A.,Saha, A., Sinha, A., & Ahmed, N. Bengali Communicative Android App for Autism Personnel. ASSET 2018, IEEE 10th International Conference on COMmunication Systems & NETworkS 2018 (COMSNETS).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 322); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-bornomala-ar-bengali-learning-experience',
    title: 'Bornomala AR-bengali learning experience using augmented reality',
    authors: [
      { customAuthor: { name: 'Motahar, T.' } },
      { customAuthor: { name: 'Fatema, T.' } },
      { customAuthor: { name: 'Das, R.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'extended-abstract',
    venue: 'mobilehci',
    citationText:
      'Motahar, T., Fatema, T., & Das, R. (2018, September). Bornomala AR-bengali learning experience using augmented reality. In Proceedings of the 20th International Conference on Human-Computer Interaction with Mobile Devices and Services Adjunct (pp. 182-188).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 330); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-changes-driving-behavior-possibly-hidden',
    title: 'Changes in Driving Behavior Possibly Hidden in Stress',
    authors: [
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Mushfique, T.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Rahman, S. A. U.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'comsnets',
    citationText:
      'Rony, R. J., Mushfique, T., Ahmed, N., Rahman, S. A. U. 2018. Changes in Driving Behavior Possibly Hidden in Stress. ASSET 2018, IEEE 10th International Conference on COMmunication Systems & NETworkS 2018 (COMSNETS)',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 314); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-chikungunya-outbreak-2017-bangladesh-clinical',
    title:
      'Chikungunya outbreak (2017) in Bangladesh: Clinical profile, economic impact and quality of life during the acute phase of the disease',
    authors: [
      { customAuthor: { name: 'Mohammad Sorowar Hossain' } },
      { customAuthor: { name: 'Md. Mahbub Hasan' } },
      { customAuthor: { name: 'Muhammad Sougatul Islam' } },
      { customAuthor: { name: 'Salequl Islam' } },
      { customAuthor: { name: 'Miliva Mozaffor' } },
      { customAuthor: { name: 'Md. Abdullah Saeed Khan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Waheed Akhtar' } },
      { customAuthor: { name: 'Shahanaz Chowdhury' } },
      { customAuthor: { name: 'S. M. Yasir Arafat' } },
      { customAuthor: { name: 'Md. Abdul Khaleque' } },
      { customAuthor: { name: 'Zohora Jameela Khan' } },
      { customAuthor: { name: 'Tashmim Farhana Dipta' } },
      { customAuthor: { name: 'Shah Md. Zahurul Haque Asna' } },
      { customAuthor: { name: 'Md. Akram Hossain' } },
      { customAuthor: { name: 'KM Sultanul Aziz' } },
      { customAuthor: { name: 'Abdullah Al Mosabbir' } },
      { customAuthor: { name: 'Enayetur Raheem' } },
    ],
    year: 2018,
    status: 'published',
    type: 'journal',
    venueLabel: 'PLOS Neglected Tropical Diseases',
    doi: '10.1371/journal.pntd.0006561',
    externalUrl: 'https://doi.org/10.1371/journal.pntd.0006561',
    isOpenAccess: true,
    citationText:
      'Hossain, M. S., Hasan, M. M., Islam, M. S., Islam, S., Mozaffor, M., Khan, M. A. S., ... & Khaleque, M. A. (2018). Chikungunya outbreak (2017) in Bangladesh: Clinical profile, economic impact and quality of life during the acute phase of the disease.PLoS neglected tropical diseases, 12(6), e0006561.',
    abstract:
      'BACKGROUND: Chikungunya virus causes mosquito-transmitted infection that leads to extensive morbidity affecting substantial quality of life. Disease associated morbidity, quality of life, and financial loss are seldom reported in resources limited countries, such as Bangladesh. We reported the acute clinical profile, quality of life and consequent economic burden of the affected individuals in the recent chikungunya outbreak (May to September 2017) in Dhaka city, Bangladesh. METHODS: We conducted a cross-sectional study during the peak of chikungunya outbreak (July 24 to August 5, 2017) to document the clinical profiles of confirmed cases (laboratory test positive) and probable cases diagnosed by medical practitioners. Data related to clinical symptoms, treatment cost, loss of productivity due to missing work days, and quality of life during their first two-weeks of symptom onset were collected via face to face interview using a structured questionnaire. World Health Organization endorsed questionnaire was used to assess the quality of life. RESULTS: A total of 1,326 chikungunya cases were investigated. Multivariate analysis of major clinical variables showed no statistically significant differences between confirmed and probable cases. All the patients reported joint pain and fever. Other more frequently reported symptoms include headache, loss of appetite, rash, myalgia, and itching. Arthralgia was polyarticular in 56.3% of the patients. Notably, more than 70% patients reported joint pain as the first presenting symptom. About 83% of the patients reported low to very low overall quality of life. Nearly 30% of the patients lost more than 10 days of productivity due to severe arthropathy. CONCLUSIONS: This study represents one of the largest samples studied so far around the world describing the clinical profile of chikungunya infection. Our findings would contribute to establish an effective syndromic surveillance system for early detection and timely public health intervention of future chikungunya outbreaks in resource-limited settings like Bangladesh.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 296); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1371/journal.pntd.0006561.",
    },
  },
  {
    id: '2018-communication-platform-breast-cancer-patient',
    title: 'Communication Platform for Breast Cancer Patient and Doctor',
    authors: [
      { customAuthor: { name: 'Saha, A.' } },
      { customAuthor: { name: 'Ahmed, R.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'comsnets',
    citationText:
      'Saha, A., Ahmed, R., & Ahmed, N. Communication Platform for Breast Cancer Patient and Doctor. ASSET 2018, IEEE 10th International Conference on COMmunication Systems & NETworkS 2018 (COMSNETS).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 318); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-connecting-systems-human',
    title: 'Connecting Systems and Human',
    authors: [{ customAuthor: { name: 'Nova Ahmed' } }],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'ubicomp',
    doi: '10.1145/3267305.3277834',
    externalUrl: 'https://doi.org/10.1145/3267305.3277834',
    isOpenAccess: false,
    citationText:
      'Ahmed, N. (2018, October). Connecting Systems and Human. In Proceedings of the 2018 ACM International Joint Conference and 2018 International Symposium on Pervasive and Ubiquitous Computing and Wearable Computers (pp. 1832-1833).',
    abstract:
      'Systems that are disconnected from human centered thinking tend to create a gap. The work presents initiatives that emphasizes on connecting them.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 312); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3267305.3277834.",
    },
  },
  {
    id: '2018-ez-parking-smart-parking-space',
    title: 'EZ Parking: Smart Parking Space Reservation Using Internet of Things',
    authors: [
      { customAuthor: { name: 'Mahdi, M. D.' } },
      { customAuthor: { name: 'Anik, Z. H.' } },
      { customAuthor: { name: 'Ahsan, R.' } },
      { customAuthor: { name: 'Motahar, T.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venueLabel:
      '2018 International Conference on Advanced Computer Science and Information Systems (ICACSIS) (pp. 113-118). IEEE',
    citationText:
      'Mahdi, M. D., Anik, Z. H., Ahsan, R., & Motahar, T. (2018, October). EZ Parking: Smart Parking Space Reservation Using Internet of Things. In 2018 International Conference on Advanced Computer Science and Information Systems (ICACSIS) (pp. 113-118). IEEE.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 328); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-hci-across-borders-paving-new',
    title: 'HCI Across Borders: Paving New Pathways',
    authors: [
      { customAuthor: { name: 'Neha Kumar' } },
      { customAuthor: { name: 'Kurtis Heimerl' } },
      { customAuthor: { name: 'David Nemer' } },
      { customAuthor: { name: 'Naveena Karusala' } },
      { customAuthor: { name: 'Aditya Vashistha' } },
      { customAuthor: { name: 'Susan M. Dray' } },
      { customAuthor: { name: 'Christian Sturm' } },
      { customAuthor: { name: 'Laura S. Gaytán-Lugo' } },
      { customAuthor: { name: 'Anicia Peters' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Nicola Dell' } },
      { customAuthor: { name: 'Jay Chen' } },
    ],
    year: 2018,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3170427.3170666',
    externalUrl: 'https://doi.org/10.1145/3170427.3170666',
    isOpenAccess: false,
    citationText:
      'Kumar, N., Heimerl, K., Nemer, D., Karusala, N., Vashistha, A., Dray, S. M., ... & Dell, N. (2018, April). HCI across borders: paving new pathways. In Extended Abstracts of the 2018 CHI Conference on Human Factors in Computing Systems (pp. 1-8).',
    abstract:
      'The HCI Across Borders (HCIxB) community has been growing in recent years, thanks in particular to the Development Consortium at CHI 2016 and the HCIxB Symposium at CHI 2017. For CHI 2018, we plan to organize an HCIxB symposium that focuses on building the scholarship potential and quality of junior HCIxB researchers - paving new pathways, while also strengthening the ties between the more and less junior members of the community.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 300); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3170427.3170666.",
    },
  },
  {
    id: '2018-how-well-our-drivers-road',
    title: 'How Well Our Drivers on Road? Discomfort is Obvious in Drivers Daily Life',
    authors: [{ customAuthor: { name: 'Rahat Jahangir Rony' } }],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'ubicomp',
    doi: '10.1145/3267305.3277809',
    externalUrl: 'https://doi.org/10.1145/3267305.3277809',
    isOpenAccess: false,
    citationText:
      'Rony, R. J. 2018. How Well Our Drivers on Road?: Discomfort is Obvious in Drivers Daily Life.UbiComp/ISWC 2018 Adjunct. DOI.org/10.1145/3267305.3277809',
    abstract:
      "Our goal is to explore the changes of driver's behavior in developing country context which changes through numerous factors and brings discomfort to their daily life. Our implemented system is able to give the insight of cardiovascular changes which indicates discomfort as well. We are trying to develop such system that may help to reduce discomfort.",
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 308); DOI stated in the NSU citation (not in ORCID); metadata from Crossref/OpenAlex for DOI 10.1145/3267305.3277809.',
    },
  },
  {
    id: '2018-mini-nurse-bot-healthcare-assistance',
    title: 'Mini Nurse-Bot: A Healthcare Assistance for Elderly People',
    authors: [
      { customAuthor: { name: 'Tamanna Motahar' } },
      { customAuthor: { name: 'Md. Fahim Farden' } },
      { customAuthor: { name: 'Md. Atiqul Islam' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Dibya Prokash Sarkar' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'ubicomp',
    doi: '10.1145/3267305.3267662',
    externalUrl: 'https://doi.org/10.1145/3267305.3267662',
    isOpenAccess: false,
    citationText:
      'Motahar, T. Farden, F., Islam, A., Rony, R. J., Sarkar, D. P. 2018. Mini Nurse-Bot: A Healthcare Assistance for Elderly People. UbiComp Demos, UbiComp/ISWC 2018 Adjunct. Singapore. DOI.org/10.1145/3267305.3267662',
    abstract:
      'In this study, an Arduino based mini nurse robot has been developed for assisting elderly people. Bangladesh which is a low income developing country has 7% of its total population of elderly people (60+ age) [8]. Elderly people are often neglected in this developing society where providing support is challenging from the family structure. An automated robot can assist them in such a situation, especially in healthcare. In the context of developing countries, automated solutions are not available and affordable compared to the developed countries. Our major contribution is to develop a low-cost healthcare robot for the elderly people to assist in taking medicines according to schedule.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 310); DOI stated in the NSU citation (not in ORCID); metadata from Crossref/OpenAlex for DOI 10.1145/3267305.3267662.',
    },
  },
  {
    id: '2018-minion-following-robot-ultrasonic-wave',
    title: 'MINION: A Following Robot Using Ultrasonic Wave',
    authors: [
      { customAuthor: { name: 'Intisar Reza Abir' } },
      { customAuthor: { name: 'Iffat Sharmim Shanim' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2018,
    status: 'published',
    type: 'book-chapter',
    venueLabel: 'Advances in Intelligent Systems and Computing',
    doi: '10.1007/978-981-10-6872-0_36',
    externalUrl: 'https://doi.org/10.1007/978-981-10-6872-0_36',
    isOpenAccess: false,
    citationText:
      'Abir, I. R., Shanim, I. S., & Ahmed, N. (2018). MINION: A Following Robot Using Ultrasonic Wave. In Progress in Advanced Computing and Intelligent Engineering (pp. 387-395). Springer, Singapore.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 334); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1007/978-981-10-6872-0_36.",
    },
  },
  {
    id: '2018-parent-enabled-learning-autism',
    title: 'Parent Enabled Learning for Autism',
    authors: [
      { customAuthor: { name: 'Sinha, A.' } },
      { customAuthor: { name: 'Abeer, I. A.' } },
      { customAuthor: { name: 'Saha, A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'comsnets',
    citationText:
      'Sinha, A., Abeer, I. A., Saha, A., & Ahmed, N. Parent Enabled Learning for Autism. ASSET 2018, IEEE 10th International Conference on COMmunication Systems & NETworkS 2018 (COMSNETS).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 320); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-protibadinext-low-cost-emergency-solution',
    title: 'ProtibadiNext: A Low Cost Emergency Solution against the Perpetrators',
    authors: [
      { customAuthor: { name: 'Mushfique, T.' } },
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Rahman, S. A. U.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'comsnets',
    citationText:
      'Mushfique, T., Rony, R. J., Ahmed, N., Rahman, S. A. U . 2018. ProtibadiNext: A Low Cost Emergency Solution against the Perpetrators.ASSET 2018, IEEE 10th International Conference on COMmunication Systems & NETworkS 2018 (COMSNETS).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 316); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-reinforcement-based-learning-communicative-android',
    title: 'Reinforcement based learning through communicative Android app for autism personnel',
    authors: [
      { customAuthor: { name: 'Ifti Azad Abeer' } },
      { customAuthor: { name: 'Anik Saha' } },
      { customAuthor: { name: 'Anik Sinha' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2018,
    status: 'published',
    type: 'extended-abstract',
    venue: 'mobilehci',
    doi: '10.1145/3236112.3236131',
    externalUrl: 'https://doi.org/10.1145/3236112.3236131',
    isOpenAccess: false,
    citationText:
      'Abeer, I. A., Saha, A., Sinha, A., & Ahmed, N. (2018, September). Reinforcement based learning through communicative Android app for autism personnel. In Proceedings of the 20th International Conference on Human-Computer Interaction with Mobile Devices and Services Adjunct (pp. 132-138). DOI.org/ 10.1145/3236112.3236131',
    abstract:
      'Autism is a rapidly growing problem all over the world. But in the developing countries like Bangladesh, the technological support for Autism is not adequate. The acutest problems children with autism faces are the communication problem. An Android app was developed to meet these needs of the children with autism. Study on the user feedbacks of the survey conducted about the review of the app suggested a very important integration to the app. The process of learning through the app can be made much more efficient by involving the parents of the autism personnel. The emotional attachment towards parents is a great fulcrum to teach autism personnel. This paper gives an overview of the development of the Android App and the integrated part of reinforcement based learning. To let the parents, aid the learning process, we have kept options for them to customize the app contents.',
    provenance: {
      source: 'crossref',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 302); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3236112.3236131.',
    },
  },
  {
    id: '2018-rickshaw-buddy-cost-effective-automated',
    title: 'RICKSHAW BUDDY: A Cost Effective Automated Auto Rickshaw Assistance System',
    authors: [
      { customAuthor: { name: 'Nur, M. B.' } },
      { customAuthor: { name: 'Motahar, T.' } },
      { customAuthor: { name: 'Masud, S. I.' } },
      { customAuthor: { name: 'Kaisar, E.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'ubicomp',
    citationText:
      'Nur, M. B., Motahar, T., Masud, S. I., & Kaisar, E. (2018, October). RICKSHAW BUDDY: A Cost Effective Automated Auto Rickshaw Assistance System. In Proceedings of the 2018 ACM International Joint Conference and 2018 International Symposium on Pervasive and Ubiquitous Computing and Wearable Computers (pp. 190-193).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 326); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-secret-bot-video-streaming-android',
    title: 'Secret Bot: A Video Streaming, Android Device Controlled Spy Robot',
    authors: [{ customAuthor: { name: 'Motahar, T.' } }],
    year: 2018,
    status: 'published',
    type: 'conference',
    venue: 'ubicomp',
    citationText:
      'Motahar, T. (2018, October). Secret Bot: A Video Streaming, Android Device Controlled Spy Robot. In Proceedings of the 2018 ACM International Joint Conference and 2018 International Symposium on Pervasive and Ubiquitous Computing and Wearable Computers (pp. 1789-1792).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 324); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-strategic-communication-counter-sexual-harassment',
    title: 'Strategic communication to counter sexual harassment in Bangladesh',
    authors: [{ customAuthor: { name: 'Ahmed, N.' } }],
    year: 2018,
    status: 'published',
    type: 'book-chapter',
    venueLabel: 'Handbook of Communication for Development and Social Change',
    citationText:
      'Ahmed, N. (2018). Strategic communication to counter sexual harassment in Bangladesh. Handbook of Communication for Development and Social Change, 1119.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 304); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2018-supporting-missing-daughters',
    title: 'Supporting Missing Daughters',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Motahar, T.' } },
      { customAuthor: { name: 'Kabir, S.' } },
      { customAuthor: { name: 'Hasan, M.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'workshop',
    venue: 'hcixb',
    citationText:
      'Ahmed, N., Motahar, T., Kabir, S. and Hasan, M. (2018). Supporting Missing Daughters, HCI Across Borders, CHI 2018. [Best Poster Award]',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 298); fields parsed from the citation text, no DOI or API match. Citation notes a Best Poster Award.',
    },
  },
  {
    id: '2018-privacy-not-me-those-rich',
    title:
      "“Privacy is not for me, it's for those rich women”: Performative Privacy Practices on Mobile Phones by Women in South Asia",
    authors: [
      { customAuthor: { name: 'Sambasivan, N.' } },
      { customAuthor: { name: 'Checkley, G.' } },
      { customAuthor: { name: 'Batool, A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Nemer, D.' } },
      { customAuthor: { name: 'Gaytán-Lugo, L.S.' } },
      { customAuthor: { name: 'Matthews, T.' } },
      { customAuthor: { name: 'Consolvo, S.' } },
      { customAuthor: { name: 'Churchill, E.' } },
    ],
    year: 2018,
    status: 'published',
    type: 'conference',
    venueLabel: 'Fourteenth Symposium on Usable Privacy and Security (SOUPS 2018), pp. 127-142',
    citationText:
      'Sambasivan, N., Checkley, G., Batool, A., Ahmed, N., Nemer, D., Gaytán-Lugo, L.S., Matthews, T., Consolvo, S. and Churchill, E., 2018. " Privacy is not for me, it\'s for those rich women": Performative Privacy Practices on Mobile Phones by Women in South Asia. In Fourteenth Symposium on Usable Privacy and Security ({SOUPS} 2018) (pp. 127-142). [IAPP Distinguished Privacy Award]',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 294); fields parsed from the citation text, no DOI or API match. Citation notes the IAPP Distinguished Privacy Award.',
    },
  },
  {
    id: '2017-gradient-sensing-middleware-handle-flash',
    title: 'A gradient sensing middleware to handle flash flood',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Shuvashis Ghosh' } },
      { customAuthor: { name: 'Rifat Ahmed Hassan' } },
      { customAuthor: { name: 'Sian Iftekher Galib' } },
      { customAuthor: { name: 'A.K. Azad' } },
      { customAuthor: { name: 'Minhaz Ahmed Syrus' } },
    ],
    year: 2017,
    status: 'published',
    type: 'journal',
    venueLabel: 'Computers & Electrical Engineering',
    doi: '10.1016/j.compeleceng.2017.08.006',
    externalUrl: 'https://doi.org/10.1016/j.compeleceng.2017.08.006',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Ghosh, S., Hassan, R. A., Galib, S. I., Azad, A. K., & Syrus, M. A. (2017). A gradient sensing middleware to handle flash flood.Computers & Electrical Engineering, 62, 44-52.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 343); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1016/j.compeleceng.2017.08.006.",
    },
  },
  {
    id: '2017-blended-learning-family-planning-policy',
    title:
      'Blended learning on family planning policy requirements: key findings and implications from a mixed methods study',
    authors: [
      { customAuthor: { name: 'Ohkubo, S.' } },
      { customAuthor: { name: 'Limaye, R.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Ballard, A.' } },
    ],
    year: 2017,
    status: 'published',
    type: 'journal',
    venueLabel: 'Annals of Global Health, 1(83), 125',
    citationText:
      'Ohkubo, S., Limaye, R., Ahmed, N., & Ballard, A. (2017). Blended learning on family planning policy requirements: key findings and implications from a mixed methods study.Annals of Global Health, 1(83), 125.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 363); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2017-chi-2017-stories-overview',
    title: 'CHI 2017 Stories Overview',
    authors: [
      { customAuthor: { name: 'Scott P. Robertson' } },
      { customAuthor: { name: 'Nazanin Andalibi' } },
      { customAuthor: { name: 'Nicholas Diakopoulos' } },
      { customAuthor: { name: 'Andrea Forte' } },
      { customAuthor: { name: 'Misa Maruyama' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Hrvoje Benko' } },
      { customAuthor: { name: 'Susan Dray' } },
      { customAuthor: { name: 'Geraldine Fitzpatrick' } },
      { customAuthor: { name: 'Rubaiat Habib' } },
      { customAuthor: { name: 'Björn Hartmann' } },
      { customAuthor: { name: 'Karen Holtzblatt' } },
      { customAuthor: { name: 'Elizabeth Rosenzweig' } },
      { customAuthor: { name: 'Preethi Srinivas' } },
      { customAuthor: { name: 'Doug Zytko' } },
    ],
    year: 2017,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/3027063.3051134',
    externalUrl: 'https://doi.org/10.1145/3027063.3051134',
    isOpenAccess: false,
    citationText:
      'Robertson, S. P., Andalibi, N., Diakopoulos, N., Forte, A., Maruyama, M., Ahmed, N., ... & Hartmann, B. (2017, May). CHI 2017 Stories Overview. In Proceedings of the 2017 CHI Conference Extended Abstracts on Human Factors in Computing Systems (pp. 14-18).',
    abstract:
      'CHI Stories is a new venue introduced at CHI 2017. A diverse set of storytellers describe personal experiences that shaped who they are and how they came to the field of Human-Computer Interaction.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 353); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3027063.3051134.",
    },
  },
  {
    id: '2017-crazy-crowd-sourcing-mitigate-resource',
    title: 'Crazy Crowd Sourcing to Mitigate Resource Scarcity',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Mahfuzur Rahman Siddiquee' } },
      { customAuthor: { name: 'Refaya Karim' } },
      { customAuthor: { name: 'Mohsina Zaman' } },
      { customAuthor: { name: 'Sayed Mahmudul Alam' } },
      { customAuthor: { name: 'Syed Fahim Ashram' } },
    ],
    year: 2017,
    status: 'published',
    type: 'conference',
    venueLabel: '2017 IEEE 37th International Conference on Distributed Computing Systems (ICDCS)',
    doi: '10.1109/icdcs.2017.321',
    externalUrl: 'https://doi.org/10.1109/icdcs.2017.321',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Siddiquee, M. R., Karim, R., Zaman, M., Alam, S. M., & Ashram, S. F. (2017, June). Crazy Crowd Sourcing to Mitigate Resource Scarcity. In 2017 IEEE 37th International Conference on Distributed Computing Systems (ICDCS) (pp. 2322-2326). IEEE.',
    abstract:
      'Resource scarcity prohibits developing country population in many ways from ubiquitous services. One such service is providing information about the best route for an ambulance in a crisis situation due to lack of proper road network information and GPS data. We have worked on a routing method in Dhaka, Bangladesh and utilized the power of crowd sourcing in times of resource scarcity. We share our challenges and opportunities that opened up followed by the challenges in this paper.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 359); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/icdcs.2017.321.",
    },
  },
  {
    id: '2017-gender-equity-technologies-considerations-design',
    title: 'Gender equity in technologies: considerations for design in the global south',
    authors: [
      { customAuthor: { name: 'Nithya Sambasivan' } },
      { customAuthor: { name: 'Garen Checkley' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Amna Batool' } },
    ],
    year: 2017,
    status: 'published',
    type: 'journal',
    venue: 'interactions',
    doi: '10.1145/3155050',
    externalUrl: 'https://doi.org/10.1145/3155050',
    isOpenAccess: false,
    citationText:
      'Sambasivan, N., Checkley, G., Ahmed, N., & Batool, A. (2017). Gender equity in technologies: considerations for design in the global south. interactions 25, 1 (2017), 58--61. Google Scholar Google Scholar Digital Library Digital Library.',
    abstract:
      'This is a forum for perspectives on designing for communities marginalized by economics, social status, infrastructure, or policies. It will discuss design methods, theoretical and conceptual contributions, and methodological engagements for underserved communities. --- Nithya Sambasivan, Editor',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 345); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3155050.",
    },
  },
  {
    id: '2017-hci-across-borders',
    title: 'HCI Across Borders',
    authors: [
      { customAuthor: { name: 'Kumar, N.' } },
      { customAuthor: { name: 'Dray, S. M.' } },
      { customAuthor: { name: 'Sturm, C.' } },
      { customAuthor: { name: 'Sambasivan, N.' } },
      { customAuthor: { name: 'Gaytán-Lugo, L. S.' } },
      { customAuthor: { name: 'Morales Diaz, L. V.' } },
      { customAuthor: { name: '...' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2017,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    citationText:
      'Kumar, N., Dray, S. M., Sturm, C., Sambasivan, N., Gaytán-Lugo, L. S., Morales Diaz, L. V., ... & Ahmed, N. (2017, May). HCI Across Borders. In Proceedings of the 2017 CHI Conference Extended Abstracts on Human Factors in Computing Systems (pp. 3065-3072).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 341); fields parsed from the citation text, no DOI or API match. Author list is truncated ("...") in the source.',
    },
  },
  {
    id: '2017-how-do-you-feel-when',
    title: 'How Do You Feel When You Are Driving?: A Participatory Approach',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Rahman, S.A.U.' } },
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Mushfique, T.' } },
    ],
    year: 2017,
    status: 'published',
    type: 'workshop',
    venueLabel: 'CHI 2017 Symposium, Denver, CO',
    citationText:
      'Ahmed, N., Rahman, S.A.U., Rony, R. J., Mushfique, T. (2017). How Do You Feel When You Are Driving?: A Participatory Approach. Symposium 2017, CHI, Denver, CO.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 355); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2017-ifreephony-minimalistic-interface-developed-visually',
    title:
      'Ifreephony: Minimalistic interface developed for the visually impaired and the elderly community in bangladesh',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Nahar, F.' } },
      { customAuthor: { name: 'Haque, A. M.' } },
    ],
    year: 2017,
    status: 'published',
    type: 'journal',
    venueLabel: 'Journal of Information and Communication Technology, 16(1), 175-191',
    citationText:
      'Ahmed, N., Nahar, F., & Haque, A. M. (2017). iFreephony: Minimalistic interface developed for the visually impaired and the elderly community in Bangladesh.Journal of Information and Communication Technology, 16(1), 175-191.',
    provenance: {
      source: 'orcid',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 351, also lines 226); title-matched to Nova Ahmed's ORCID (no DOI there), so title/year from ORCID and authors/venue parsed from the citation.",
    },
  },
  {
    id: '2017-new-narratives-global-health-stories',
    title:
      'New Narratives in Global Health: Using Stories and Storytelling to Promote Family Planning',
    authors: [
      { customAuthor: { name: 'R Limaye' } },
      { customAuthor: { name: 'A Ballard' } },
      { customAuthor: { name: 'E Futrell' } },
      { customAuthor: { name: 'N Ahmed' } },
      { customAuthor: { name: 'S Ohkubo' } },
    ],
    year: 2017,
    status: 'published',
    type: 'journal',
    venueLabel: 'Annals of Global Health, 1(83), 106',
    citationText:
      'R Limaye, A Ballard, E Futrell, N Ahmed, S Ohkubo.(2017 ).New Narratives in Global Health: Using Stories and Storytelling to Promote Family Planning. Annals of Global Health, 1(83),106.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 361); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2017-optimized-route-planer-application',
    title: 'Optimized route planer application',
    authors: [
      { customAuthor: { name: 'Sayed Mahmudul Alam' } },
      { customAuthor: { name: 'Syed Fahim Ashraf Rehan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2017,
    status: 'published',
    type: 'conference',
    venueLabel: '2017 IEEE Region 10 Humanitarian Technology Conference (R10-HTC)',
    doi: '10.1109/r10-htc.2017.8288922',
    externalUrl: 'https://doi.org/10.1109/r10-htc.2017.8288922',
    isOpenAccess: false,
    citationText:
      'Alam, S. M., Rehan, S. F. A., & Ahmed, N. (2017, December). Optimized route planer application. In 2017 IEEE Region 10 Humanitarian Technology Conference (R10-HTC) (pp. 125-129). IEEE.',
    abstract:
      'The current traffic condition in Dhaka city requires major planning when multiple routes are covered. A route optimization algorithm can support a person to make better decisions which requires to be dynamic and efficient. We have developed a route optimization application for mobile devices that uses existing sparse GPS location information and collected traffic data information of the routes to generate optimal routes that costs relatively less time and money.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 347); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/r10-htc.2017.8288922.",
    },
  },
  {
    id: '2017-simple-group-photo-sharing-facesense',
    title: 'Simple Group Photo Sharing Using Facesense',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Minhaz Ahmed Syrus' } },
      { customAuthor: { name: 'Arshad Chowdhury' } },
    ],
    year: 2017,
    status: 'published',
    type: 'conference',
    venueLabel: '2017 IEEE 41st Annual Computer Software and Applications Conference (COMPSAC)',
    doi: '10.1109/compsac.2017.212',
    externalUrl: 'https://doi.org/10.1109/compsac.2017.212',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Syrus, M. A., & Chowdhury, A. (2017, July). Simple Group Photo Sharing Using Facesense. In 2017 IEEE 41st Annual Computer Software and Applications Conference (COMPSAC) (Vol. 1, pp. 845-850). IEEE.',
    abstract:
      'Harassment, based on photos available on social media and other electronic media, has become a major problem in developing countries where internet usage has emerged without adaptation to privacy, awareness etc. We have developed a software sensing layer on top of existing software that would exploit the social connections and use that information to make sure certain images are revealed or not across group of people conceptualized as Softsense. A prototype implementation of the system is deployed named Facesense that is a small network for only photo sharing. Our proof of concept system has been deployed and used by students of a particular University in Bangladesh and after two weeks of usage, students have shared their views, concerns and experiences regarding the tool.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 357); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/compsac.2017.212.",
    },
  },
  {
    id: '2017-working-women-ictd',
    title: 'Working with Women in ICTD',
    authors: [
      { customAuthor: { name: 'Jasmine Hentschel' } },
      { customAuthor: { name: 'Syed Ishtiaque Ahmed' } },
      { customAuthor: { name: 'Faheem Hussain' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Neha Kumar' } },
    ],
    year: 2017,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/3136560.3136585',
    externalUrl: 'https://doi.org/10.1145/3136560.3136585',
    isOpenAccess: false,
    citationText:
      'Hentschel, J., Ahmed, S. I., Hussain, F., Ahmed, N., & Kumar, N. (2017, November). Working with Women in ICTD. In Proceedings of the Ninth International Conference on Information and Communication Technologies and Development (pp. 1-5).',
    abstract:
      'The fifth Sustainable Development Goal instituted by the United Nations in 2015 presents a call for gender equality, targeting the elimination of "discrimination, violence, and exploitation against women". We present an analysis of recent conversations within the Information and Communication Technology and Development (ICTD) community aiming to identify ways in which the community might approach conceptualizing, designing, and deploying ICTs to address vital concerns in this regard. We also articulate ways to frame and address key challenges moving forward through more holistic and sustainable approaches, greater engagement with diverse stakeholders, and evolved methodological toolkits.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2017 heading, line 349); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3136560.3136585.",
    },
  },
  {
    id: '2016-improved-interactive-system-fulfill-basic',
    title: 'An improved and interactive system to fulfill basic human healthcare needs',
    authors: [
      { customAuthor: { name: 'Iftifar Taz' } },
      { customAuthor: { name: 'Amran Ahmed' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2016,
    status: 'published',
    type: 'conference',
    venue: 'iccit',
    doi: '10.1109/iccitechn.2016.7860254',
    externalUrl: 'https://doi.org/10.1109/iccitechn.2016.7860254',
    isOpenAccess: false,
    citationText:
      'Taz, I., Ahmed, A., & Ahmed, N. (2016, December). An improved and interactive system to fulfill basic human healthcare needs. In 2016 19th International Conference on Computer and Information Technology (ICCIT) (pp. 530-534). IEEE.',
    abstract:
      'Adequate healthcare has always been a topic of concern in Bangladesh. As the population of Bangladesh is increasing exponentially, it has become impossible to deliver proper healthcare to all of its residence. For that reason alternate resources for healthcare have become almost a necessity today. Modern world is driven by technology and electronic healthcare system can be the solution we are looking for. With that in mind we took a step to merge a part of healthcare system with internet to ensure better healthcare for the inhabitants of Bangladesh.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 378); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iccitechn.2016.7860254.",
    },
  },
  {
    id: '2016-assessing-driving-stress-custom-built',
    title: 'Assessing Driving Stress using Custom Built Real Time Sensors',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Rahman, S. A. U.' } },
      { customAuthor: { name: 'Rony, R. J.' } },
      { customAuthor: { name: 'Mushfique, T.' } },
    ],
    year: 2016,
    status: 'published',
    type: 'conference',
    venueLabel:
      'International Conference on Computer, Communication, Chemical, Material and Electronic Engineering (IC4ME2)',
    citationText:
      'Ahmed, N., Rahman, S. A. U., Rony, R. J., & Mushfique, T. (2016). Assessing Driving Stress using Custom Built Real Time Sensors. In International Conference on Computer, Communication, Chemical, Material and Electronic Engineering, IC4ME2.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 374); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2016-computing-beyond-gender-imposed-limits',
    title: 'Computing beyond gender-imposed limits',
    authors: [
      { customAuthor: { name: 'Syed Ishtiaque Ahmed' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Faheem Hussain' } },
      { customAuthor: { name: 'Neha Kumar' } },
    ],
    year: 2016,
    status: 'published',
    type: 'conference',
    venueLabel: 'Proceedings of the Second Workshop on Computing within Limits',
    doi: '10.1145/2926676.2926681',
    externalUrl: 'https://doi.org/10.1145/2926676.2926681',
    isOpenAccess: false,
    citationText:
      'Ahmed, S. I., Ahmed, N., Hussain, F., & Kumar, N. (2016, June). Computing beyond gender-imposed limits. In proceedings of the Second workshop on Computing within Limits (pp. 1-7).',
    abstract:
      'Gender inequality has long been on the list of factors that impose limits on the potential of computing, in ways that have been more and less obvious. Drawing on ethnographic findings from marginalized communities in Bangladesh, we analyze the impact of gender inequality on the stages of user research, design, deployment, and use of computing technologies. We conclude with a discussion of how a combination of design, policy, and/or theoretical approaches might supply us with tools to combat the challenges faced in these stages in order to bring about greater equity and participation in the world of computing.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 368); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2926676.2926681.",
    },
  },
  {
    id: '2016-discussing-about-sexual-harassment-breaking',
    title: 'Discussing about Sexual Harassment (Breaking Silence): The Role of Technology',
    authors: [{ customAuthor: { name: 'Nova Ahmed' } }],
    year: 2016,
    status: 'published',
    type: 'extended-abstract',
    venue: 'chi',
    doi: '10.1145/2851581.2892567',
    externalUrl: 'https://doi.org/10.1145/2851581.2892567',
    isOpenAccess: false,
    citationText:
      'Ahmed, N. (2016, May). Discussing about Sexual Harassment (Breaking Silence) The Role of Technology. In Proceedings of the 2016 CHI conference extended abstracts on human factors in computing systems (pp. 459-472).',
    abstract:
      'Technology can play an important role to flght social problems. We have explored the role of technology in sexual harassment through our yearlong qualitative study on urban female undergraduate students. The existing notion of fear, mistrust and hope towards technology affects the discussion as presented in our research.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 370); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2851581.2892567.",
    },
  },
  {
    id: '2016-my-code-my-native-tone',
    title: 'My Code in My Native Tone: Cha Script',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Arman Kamal' } },
      { customAuthor: { name: 'Adnan Nuruddin' } },
      { customAuthor: { name: 'Syed Tanveer Jishan' } },
    ],
    year: 2016,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/2909609.2909611',
    externalUrl: 'https://doi.org/10.1145/2909609.2909611',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Kamal, A., Nuruddin, A., & Jishan, S. T. (2016, June). My code in my native tone: Cha Script. In Proceedings of the Eighth International Conference on Information and Communication Technologies and Development (pp. 1-4).',
    abstract:
      'Can we code better if we have our native language to code in? In a developing country like Bangladesh where most of the young learners are exposed to Bengali as their study medium, students often find it challenging to translate their thoughts into a foreign language. They need to focus more on the language rather than the logic or program solving. We have designed a native Bengali scripting language named Cha Script and have conducted a short study among users about its possibilit',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 384); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2909609.2909611.",
    },
  },
  {
    id: '2016-poster-protibaadi-extended-solution-deal',
    title: 'Poster: Protibaadi: An Extended Solution to Deal with Sexual Harassment',
    authors: [
      { customAuthor: { name: 'Nabila Rezwana Mirza' } },
      { customAuthor: { name: 'Shareen Mahmud' } },
      { customAuthor: { name: 'Prosonna Hossain Nabila' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2016,
    status: 'published',
    type: 'extended-abstract',
    venueLabel:
      'Proceedings of the 14th Annual International Conference on Mobile Systems, Applications, and Services Companion',
    doi: '10.1145/2938559.2948796',
    externalUrl: 'https://doi.org/10.1145/2938559.2948796',
    isOpenAccess: false,
    citationText:
      'Mirza, N. R., Mahmud, S., Nabila, P. H., & Ahmed, N. (2016, June). Poster: Protibaadi: An Extended Solution to Deal with Sexual Harassment. In Proceedings of the 14th Annual International Conference on Mobile Systems, Applications, and Services Companion (pp. 59-59).',
    abstract:
      "Protibaadi, which addresses the issue of women's safety in public places, is a system consisting of a portable device which remotely activates a mobile application. The existing safety apps draw attention and it is risky to bring out cell phones in front of the harasser to seek help. Protibaadi allows the users to carry a hidden device inside a pouch which can either be worn or clipped to the user's bag.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 382); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2938559.2948796.",
    },
  },
  {
    id: '2016-protibaadinext-low-cost-wearable-system',
    title:
      'ProtibaadiNext: A Low Cost Wearable System to Deal with Sexual Harassment in Bangladesh',
    authors: [
      { customAuthor: { name: 'Prosonna Nabila' } },
      { customAuthor: { name: 'Shareen Mahmud' } },
      { customAuthor: { name: 'Nabila Mirza' } },
      { customAuthor: { name: 'Rahat Rony' } },
      { customAuthor: { name: 'MD Mushfique' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Saad Azmeen-ur-Rahman' } },
    ],
    year: 2016,
    status: 'published',
    type: 'conference',
    venueLabel:
      'Proceedings of the The 8th EAI International Conference on Mobile Computing, Applications and Services',
    doi: '10.4108/eai.30-11-2016.2267059',
    externalUrl: 'https://doi.org/10.4108/eai.30-11-2016.2267059',
    isOpenAccess: false,
    citationText:
      'Nabila, P., Mahmud, S., Mirza, N., Rony, R., Mushfique, M. D., Ahmed, N., & Azmeen-ur-Rahman, S. (2016, December). ProtibaadiNext: A Low Cost Wearable System to Deal with Sexual Harassment in Bangladesh. In Proceedings of the 8th EAI International Conference on Mobile Computing, Applications and Services (pp. 138-139).',
    abstract:
      'ProtibaadiNext is a compact, low cost and power efficient wearable system that has been designed to fight against sexual harassment in developing countries like Bangladesh. The wearable device, which is connected to a safety application on the user’s Smartphone, can be used to secretly disseminate A',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 386); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.4108/eai.30-11-2016.2267059.",
    },
  },
  {
    id: '2016-protibadi-next-sensor-support-handle',
    title: 'Protibadi next: sensor support to handle sexual harassment',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Sadd Azmeen Ur Rahman' } },
      { customAuthor: { name: 'Rahat Jahangir Rony' } },
      { customAuthor: { name: 'Tanvir Mushfique' } },
      { customAuthor: { name: 'Vikram Mehta' } },
    ],
    year: 2016,
    status: 'published',
    type: 'extended-abstract',
    venue: 'ubicomp',
    doi: '10.1145/2968219.2979133',
    externalUrl: 'https://doi.org/10.1145/2968219.2979133',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Rahman, S. A. U., Rony, R. J., Mushfique, T., & Mehta, V. (2016, September). Protibadinext: Sensor support to handle sexual harassment. In Proceedings of the 2016 ACM International Joint Conference on Pervasive and Ubiquitous Computing: Adjunct (pp. 918-921).',
    abstract:
      'Sexual harassment is a major problem in developing countries like Bangladesh and it requires a sensing enabled solution that does not get the attention of the harasser/attacker. We have worked on physical external sensors that have failed to meet the above criterion which has gone through the process of continuous improvement and we hope to work out an on skin sensor as a future direction.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 380); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2968219.2979133.",
    },
  },
  {
    id: '2016-shonabondhu-cloud-based-system-handle',
    title: 'ShonaBondhu: a cloud based system to handle flash flood',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'A.K. Azad' } },
      { customAuthor: { name: 'Mahmudur Rahman Khan' } },
      { customAuthor: { name: 'Ahsan Habib' } },
      { customAuthor: { name: 'Shuvashish Ghosh' } },
      { customAuthor: { name: 'Sabiha Shahid' } },
    ],
    year: 2016,
    status: 'published',
    type: 'conference',
    venueLabel: '2016 International Conference on Networking Systems and Security (NSysS)',
    doi: '10.1109/nsyss.2016.7400688',
    externalUrl: 'https://doi.org/10.1109/nsyss.2016.7400688',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Azad, A. K., Khan, M. R., Habib, A., Ghosh, S., & Shahid, S. (2016, January). ShonaBondhu: a cloud based system to handle flash flood. In 2016 international conference on networking systems and security (NSysS) (pp. 1-6). IEEE.',
    abstract:
      'Flash Flood is a natural disaster that floods away large area where there are dense presence of rivers. Bangladesh is one such country where people face this sudden flood problem and loses valuable assets using manual water level monitoring. The challenge lies in the sudden increase of water level once the flood water is in. We are proposing a distributed system using water level monitoring sensors named Shonabondhu. The sensing nodes are distributed all across the country and the servers that collect data from sensors are spread around various regions. The servers use a function of rainfall and current water level that indicate a particular gradient to that sensor. The gradient information among sensors are related using the water level and rainfall data over four years (2008 to 2011). This gradient information is updated and propagated when any kind of change is present near the source of the river. A communication abstraction is created to propagate sensitive information and periodic updates of current status. We have used actual sensors to monitor the water level in the river and have used emulated sensors to mimic the behavior in large distributed system. Our current system works as a proof of a concept system before the actual deployment of this system in collaboration of Water Development Board of Bangladesh.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 372); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/nsyss.2016.7400688.",
    },
  },
  {
    id: '2016-softsense-sensing-software-level',
    title: 'Softsense: sensing at software level',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Minhaz Ahmed Syrus' } },
      { customAuthor: { name: 'Arshad M. Chowdhury' } },
    ],
    year: 2016,
    status: 'published',
    type: 'extended-abstract',
    venue: 'ubicomp',
    doi: '10.1145/2968219.2971457',
    externalUrl: 'https://doi.org/10.1145/2968219.2971457',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Syrus, M. A., & Chowdhury, A. M. (2016, September). Softsense: sensing at software level. In Proceedings of the 2016 ACM International Joint Conference on Pervasive and Ubiquitous Computing: Adjunct (pp. 1-4).',
    abstract:
      'Large scale information sharing can become a concern in terms of privacy which often causes abusive usage of information. We look at photo sharing in facebook which has become source of abusive usage when users are not aware privacy issues. A software level system can explore the user requirements and play a role on presenting data in ways approved by users. The concept of sensing at software level is presented in our system named Softsense.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 388); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2968219.2971457.",
    },
  },
  {
    id: '2016-urban-search-rescue-mission-use',
    title: 'Urban search and rescue mission: The use of marsupial robots',
    authors: [
      { customAuthor: { name: 'Mashrik, T.' } },
      { customAuthor: { name: 'Baized, A. M.' } },
      { customAuthor: { name: 'Iftekhar, L.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2016,
    status: 'published',
    type: 'journal',
    venueLabel: 'Journal of Modern Science and Technology, 4(1)',
    citationText:
      'Mashrik, T., Baized, A. M., Iftekhar, L., & Ahmed, N. (2016). Urban search and rescue mission: The use of marsupial robots.Journal of Modern Science and Technology, 4(1).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2016 heading, line 376); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2015-skin-disease-detection-system-financially',
    title:
      'A skin disease detection system for financially unstable people in developing countries',
    authors: [
      { customAuthor: { name: 'Yasir, R.' } },
      { customAuthor: { name: 'Nibir, M. S. I.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2015,
    status: 'published',
    type: 'journal',
    venueLabel: 'Global Science and Technology Journal, 3(1), 77-93',
    citationText:
      'Yasir, R., Nibir, M. S. I., & Ahmed, N. (2015). A skin disease detection system for financially unstable people in developing countries.Global Science and Technology Journal, 3(1), 77-93.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 397); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2015-smart-phone-that-acts-unsmart',
    title:
      'A smart phone that acts unsmart: An assistive touch screenuser interface for visually impaired people',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'Nahar, F.' } },
      { customAuthor: { name: 'Haque, A. M.' } },
      { customAuthor: { name: 'Chowdhury, A. M.' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venueLabel:
      'Proceedings of the Fourth International Conference on Internet Applications, Protocols and Services (pp. 218-223)',
    citationText:
      'Ahmed, N., Nahar, F., Haque, A. M., & Chowdhury, A. M. (2015). A smart phone that acts unsmart: An assistive touch screenuser interface for visually impaired people. In Proceedings of the Fourth International Conference on Internet Applications, Protocols and Services (pp. 218-223).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 409); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2015-banglacloud-cloud-infrastructure-abandoned-computers',
    title: 'BanglaCloud: A cloud infrastructure with abandoned computers',
    authors: [
      { customAuthor: { name: 'Md. Abul Kalam Azad' } },
      { customAuthor: { name: 'Nahid Islam' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venueLabel:
      '2015 International Conference on Electrical Engineering and Information Communication Technology (ICEEICT)',
    doi: '10.1109/iceeict.2015.7307444',
    externalUrl: 'https://doi.org/10.1109/iceeict.2015.7307444',
    isOpenAccess: false,
    citationText:
      'Azad, M. A. K., Islam, N., & Ahmed, N. (2015, May). BanglaCloud: A cloud infrastructure with abandoned computers. In 2015 International Conference on Electrical Engineering and Information Communication Technology (ICEEICT) (pp. 1-5). IEEE.',
    abstract:
      'Cloud computing is an emerging area in recent days where large scale data needs to be processed even in developing and under developed countries. We have proposed a cloud structure which uses abandoned hardware along with high performance devices based on user traffic to minimize the cloud access cost named as BanglaCloud. We have done extensive study on single compute level (BanglaNode) and considered a large scale simulation using these nodes which shows positive promises.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 413); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iceeict.2015.7307444.",
    },
  },
  {
    id: '2015-bap-re-bap-driving-experiences',
    title: 'Bap re Bap! Driving Experiences through Multimodal Unruly Traffic on Bumpy Roads',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Lamia Iftekhar' } },
      { customAuthor: { name: 'Silvia Ahmed' } },
      { customAuthor: { name: 'Ridwan Rahman' } },
      { customAuthor: { name: 'Tanveer Reza' } },
      { customAuthor: { name: 'Sarah Shoilee' } },
      { customAuthor: { name: 'Charisma F. Choudhury' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venueLabel: 'Proceedings of the 2015 Annual Symposium on Computing for Development',
    doi: '10.1145/2830629.2835214',
    externalUrl: 'https://doi.org/10.1145/2830629.2835214',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Iftekhar, L., Ahmed, S., Rahman, R., Reza, T., Shoilee, S., & Choudhury, C. F. (2015, December). Bap re Bap! Driving Experiences through Multimodal Unruly Traffic on Bumpy Roads. In Proceedings of the 2015 annual symposium on computing for development (pp. 63-64).',
    abstract:
      "Congestion, lack of compliance to traffic laws, multimodal traffic, opportunistic decision making and poor road conditions are few of the key challenges faced by drivers in a developing country's metropolitan city such as, Dhaka, Bangladesh. The driver's experience is affected by such road conditions which in turn shapes up their driving behavior and thus affects the traffic conditions which has been studied using sensor enabled tools as well as qualitative methods from a developing country's context.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 403); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2830629.2835214.",
    },
  },
  {
    id: '2015-dynamic-load-sharing-maximize-resource',
    title: 'Dynamic Load Sharing to Maximize Resource Utilization Within Cloud Federation',
    authors: [
      { customAuthor: { name: 'Md. S. Q. Zulkar Nine' } },
      { customAuthor: { name: 'Md. Abul Kalam Azad' } },
      { customAuthor: { name: 'Saad Abdullah' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2015,
    status: 'published',
    type: 'book-chapter',
    venueLabel: 'Lecture Notes in Computer Science',
    doi: '10.1007/978-3-319-28430-9_10',
    externalUrl: 'https://doi.org/10.1007/978-3-319-28430-9_10',
    isOpenAccess: false,
    citationText:
      'Nine, M. S. Z., Azad, M. A. K., Abdullah, S., & Ahmed, N. (2015, June). Dynamic load sharing to maximize resource utilization within cloud federation. In Second International Conference on Cloud Computing and Big Data in Asia (pp. 125-137). Springer, Cham.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 407); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1007/978-3-319-28430-9_10.",
    },
  },
  {
    id: '2015-electrical-computer-engineering-laboratory-education',
    title:
      'Electrical and computer engineering laboratory education for female undergraduate students: Challenges and solutions from an urban perspective of Bangladesh',
    authors: [
      { customAuthor: { name: 'Lamia Iftekhar' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Fahima Chowdhury' } },
      { customAuthor: { name: 'Ridita Rahman' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venueLabel: '2015 10th International Conference on Computer Science & Education (ICCSE)',
    doi: '10.1109/iccse.2015.7250276',
    externalUrl: 'https://doi.org/10.1109/iccse.2015.7250276',
    isOpenAccess: false,
    citationText:
      'Iftekhar, L., Ahmed, N., Chowdhury, F., & Rahman, R. (2015, July). Electrical and computer engineering laboratory education for female undergraduate students: Challenges and solutions from an urban perspective of Bangladesh. In 2015 10th International Conference on Computer Science & Education (ICCSE) (pp. 389-394). IEEE.',
    abstract:
      'This paper describes the results of a multi-modal study to explore the performance of female undergraduate students in Electrical and Computer Engineering laboratory settings of urban universities of Bangladesh. Observing a distinct difference in enthusiasm and performance in laboratory education versus theory education amongst female students, we dig deeper to investigate whether there is a systematic reluctance or hindrance in developing hands-on/laboratory skills for female students and what factors may affect their laboratory education. A few distinct themes describing the status quo of female laboratory education are formalized based on the study and solution approaches are presented to improve the current situation.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 393); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iccse.2015.7250276.",
    },
  },
  {
    id: '2015-entering-dream-world-computers',
    title: 'Entering the dream world of computers',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'A. M. Masudul Haque' } },
      { customAuthor: { name: 'Luke Doyle' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venue: 'ictd',
    doi: '10.1145/2737856.2737860',
    externalUrl: 'https://doi.org/10.1145/2737856.2737860',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Haque, A. M., & Doyle, L. (2015, May). Entering the dream world of computers. In Proceedings of the Seventh International Conference on Information and Communication Technologies and Development (pp. 1-4).',
    abstract:
      'Dropping out from school is a major problem among underprivileged children. A computer school designed to support these children named Computers Are Free for Everyone in short CAFFE, began three years ago in the hope to provide alternate source of living. some students of CAFFE later returned to regular schools, as they found hope and began to dream of a better life. The story of inspiration, motivation and hope from technology studies is shared here.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 401); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2737856.2737860.",
    },
  },
  {
    id: '2015-map-matching-error-prone-gps',
    title:
      'Map matching for error prone GPS data on a sparse road network and predicting travel time of a route',
    authors: [
      { customAuthor: { name: 'Md. Mahfuzur Rahman Siddiquee' } },
      { customAuthor: { name: 'Refaya Karim' } },
      { customAuthor: { name: 'Mohsina Zaman Khan' } },
      { customAuthor: { name: 'Rifat Monzur' } },
      { customAuthor: { name: 'Lamia Iftekhar' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venue: 'iccit',
    doi: '10.1109/iccitechn.2015.7488035',
    externalUrl: 'https://doi.org/10.1109/iccitechn.2015.7488035',
    isOpenAccess: false,
    citationText:
      'Siddiquee, M. M. R., Karim, R., Khan, M. Z., Monzur, R., Iftekhar, L., & Ahmed, N. (2015, December). Map matching for error prone GPS data on a sparse road network and predicting travel time of a route. In 2015 18th International Conference on Computer and Information Technology (ICCIT) (pp. 17-22). IEEE.',
    abstract:
      'Optimal ambulance route detection in an urban area is a challenging problem especially in the presence of difficulties such as sparse road network, error-prone GPS data and irregular traffic conditions. We have worked on solutions robust to these challenges and for the first time ever in the context of Dhaka, Bangladesh. This paper presents our newly designed map-matching algorithms as well as an intelligent route prediction scheme. We have implemented our algorithms on real traffic data and discuss the results here.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 395); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iccitechn.2015.7488035.",
    },
  },
  {
    id: '2015-map-matching-sparse-gps-data',
    title: 'Map matching on sparse gps data: A perspective of a developing city',
    authors: [
      { customAuthor: { name: 'Ahmed, N.' } },
      { customAuthor: { name: 'SIDDIQUEE, M. M. R.' } },
      { customAuthor: { name: 'KARIM, R.' } },
      { customAuthor: { name: 'ZAMAN, M.' } },
      { customAuthor: { name: 'MONZUR, R.' } },
      { customAuthor: { name: 'HOSSAIN, M.' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venueLabel: 'Proceedings of the Eastern Asia Society for Transportation Studies (Vol. 10)',
    citationText:
      'Ahmed, N., SIDDIQUEE, M. M. R., KARIM, R., ZAMAN, M., MONZUR, R., & HOSSAIN, M. (2015). Map matching on sparse gps data: A perspective of a developing city. In Proceedings of the Eastern Asia Society for Transportation Studies (Vol. 10).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 399); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2015-poster-shonabondhu-sensing-middleware-handle',
    title: 'Poster: Shonabondhu: A Sensing Middleware to Handle Flash Flood',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Mahmudur Rahman Khan' } },
      { customAuthor: { name: 'Minhaz Ahmed Syrus' } },
    ],
    year: 2015,
    status: 'published',
    type: 'conference',
    venueLabel: 'Proceedings of the 13th ACM Conference on Embedded Networked Sensor Systems',
    doi: '10.1145/2809695.2817874',
    externalUrl: 'https://doi.org/10.1145/2809695.2817874',
    isOpenAccess: false,
    citationText:
      'Ahmed, N., Khan, M. R., & Syrus, M. A. (2015, November). Poster: Shonabondhu: A Sensing Middleware to Handle Flash Flood. In Proceedings of the 13th ACM Conference on Embedded Networked Sensor Systems (pp. 381-382).',
    abstract:
      'We present a distributed custom developed low cost sensing middleware named Shonabondhu that is able to handle flash flood in developing countries like Bangladesh.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 405); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2809695.2817874.",
    },
  },
  {
    id: '2015-telemedicine-system-financially-unstable-people',
    title: 'Telemedicine system for financially unstable people of Bangladesh',
    authors: [
      { customAuthor: { name: 'Yasir, R.' } },
      { customAuthor: { name: 'Nibir, S. I.' } },
      { customAuthor: { name: 'Chadni, Z. A.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2015,
    status: 'published',
    type: 'journal',
    venueLabel: 'Journal of Modern Science and Technology, 3(1)',
    citationText:
      'Yasir, R., Nibir, S. I., Chadni, Z. A., & Ahmed, N. (2015). Telemedicine system for financially unstable people of Bangladesh.J Modern Sci Technol, 3(1).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2015 heading, line 411); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-skin-disease-detection-system-financially',
    title:
      'A Skin Disease Detection System for Financially Unstable People in Developing Countries ',
    authors: [
      { customAuthor: { name: 'Rahat Yasir' } },
      { customAuthor: { name: 'Md. Ashiqur Rahman' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venueLabel: '10th Global Engineering, Science and Technology Conference',
    citationText:
      'Rahat Yasir, Md. Ashiqur Rahman and Nova Ahmed (2014). A Skin Disease Detection System for Financially Unstable People in Developing Countries . In 10th Global Engineering, Science and Technology Conference .',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 440); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-beetles-mobile-application-detect-crop',
    title: 'Beetles: A Mobile Application to Detect Crop Disease for Farmers in Rural Area',
    authors: [{ customAuthor: { name: 'Yasir, R.' } }, { customAuthor: { name: 'Ahmed, N.' } }],
    year: 2014,
    status: 'published',
    type: 'workshop',
    venueLabel: 'Workshop on Human And Technology (WHAT)',
    citationText:
      'Yasir, R., & Ahmed, N. (2014, March). Beetles: A Mobile Application to Detect Crop Disease for Farmers in Rural Area. In Workshop on Human And Technology (WHAT) (pp. 8-10).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 428); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-chascript-breaking-language-barrier-bengali',
    title: 'ChaScript: Breaking language barrier using a bengali programming system',
    authors: [
      { customAuthor: { name: 'Arman Kamal' } },
      { customAuthor: { name: 'Md. Nuruddin Monsur' } },
      { customAuthor: { name: 'Syed Tanveer Jishan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venue: 'icece',
    doi: '10.1109/icece.2014.7026875',
    externalUrl: 'https://doi.org/10.1109/icece.2014.7026875',
    isOpenAccess: false,
    citationText:
      'Kamal, A., Monsur, M. N., Jishan, S. T., & Ahmed, N. (2014, December). ChaScript: Breaking language barrier using a bengali programming system. In 8th International Conference on Electrical and Computer Engineering (pp. 441-444). IEEE.',
    abstract:
      'As technology is evolving as a driving force in our society, the need for computer programming is arising. However, since most of the computer programming languages are English-based, they can act as barriers for learning computer programming for people who are not adequate in English. In this paper we present a Non-English based educational programming system which was build with the goal to help Bengali speaking people learn and write computer programs in Bengali. We have also discussed how the system was build and why it will be useful for Bengali students to use as a platform to learn computer programming.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 430); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/icece.2014.7026875.",
    },
  },
  {
    id: '2014-computer-vision-based-road-traffic',
    title:
      'Computer vision based road traffic accident and anomaly detection in the context of Bangladesh',
    authors: [
      { customAuthor: { name: 'Mirza M. Lutfe Elahi' } },
      { customAuthor: { name: 'Rahat Yasir' } },
      { customAuthor: { name: 'Minhaz Ahmed Syrus' } },
      { customAuthor: { name: 'Md. S. Q. Zulkar Nine' } },
      { customAuthor: { name: 'Ishtiaque Hossain' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venue: 'iciev',
    doi: '10.1109/iciev.2014.6850780',
    externalUrl: 'https://doi.org/10.1109/iciev.2014.6850780',
    isOpenAccess: false,
    citationText:
      'Elahi, M. M. L., Yasir, R., Syrus, M. A., Nine, M. S. Z., Hossain, I., & Ahmed, N. (2014, May). Computer vision based road traffic accident and anomaly detection in the context of Bangladesh. In 2014 International Conference on Informatics, Electronics & Vision (ICIEV) (pp. 1-6). IEEE.',
    abstract:
      'Road traffic accident is one of the major causes of death in Bangladesh. In this article, we propose a method that uses road side video data to learn the traffic pattern and uses vision based techniques to track and determine various kinetic features of vehicles. Finally, the proposed method detects anomaly (possibility of accident) and accidents on the road. The proposed method shows approximately 85% accuracy level in detecting special situations.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 424); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iciev.2014.6850780.",
    },
  },
  {
    id: '2014-dermatological-disease-detection-image-processing',
    title: 'Dermatological disease detection using image processing and artificial neural network',
    authors: [
      { customAuthor: { name: 'Rahat Yasir' } },
      { customAuthor: { name: 'Md. Ashiqur Rahman' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venue: 'icece',
    doi: '10.1109/icece.2014.7026918',
    externalUrl: 'https://doi.org/10.1109/icece.2014.7026918',
    isOpenAccess: false,
    citationText:
      'Yasir, R., Rahman, M. A., & Ahmed, N. (2014, December). Dermatological disease detection using image processing and artificial neural network. In 8th International Conference on Electrical and Computer Engineering (pp. 687-690). IEEE.',
    abstract:
      'Skin diseases are among the most common health problems worldwide. In this article we proposed a method that uses computer vision based techniques to detect various kinds of dermatological skin diseases. We have used different types of image processing algorithms for feature extraction and feed forward artificial neural network for training and testing purpose. The system works on two phases- first pre-process the colour skin images to extract significant features and later identifies the diseases. The system successfully detects 9 different types of dermatological skin diseases with an accuracy rate of 90%.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 420); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/icece.2014.7026918.",
    },
  },
  {
    id: '2014-efficient-reliable-hybrid-cloud-architechture',
    title: 'Efficient and reliable hybrid cloud architechture for big data',
    authors: [{ customAuthor: { name: 'Tarannum, N.' } }, { customAuthor: { name: 'Ahmed, N.' } }],
    year: 2014,
    status: 'preprint',
    type: 'preprint',
    venueLabel: 'arXiv',
    externalUrl: 'https://arxiv.org/abs/1405.5200',
    citationText:
      'Tarannum, N., & Ahmed, N. (2014). Efficient and reliable hybrid cloud architechture for big data. arXiv preprint arXiv:1405.5200.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 426); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-empowering-local-government-decentralised-wash',
    title: 'Empowering local government through decentralised WASH programmes in Bangladesh',
    authors: [{ customAuthor: { name: 'AHMED, N.' } }, { customAuthor: { name: 'KABIR, E.' } }],
    year: 2014,
    status: 'published',
    type: 'conference',
    venueLabel: '37th WEDC International Conference, Hanoi, Vietnam',
    citationText:
      'AHMED, N., & KABIR, E. (2014, September). Empowering local government through decentralised WASH programmes in Bangladesh. In Sustainable water and sanitation services for all in a fast changing world: Proceedings of the 37th WEDC International Conference, Hanoi, Vietnam (pp. 15-19). cс WEDC, Loughborough University.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 434); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-hybrid-cloud-infrastructure-handle-large',
    title:
      'Hybrid cloud infrastructure to handle large scale data for bangladesh people search (BDPS)',
    authors: [
      { customAuthor: { name: 'Narzu Tarannum' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venue: 'iciev',
    doi: '10.1109/iciev.2014.6850681',
    externalUrl: 'https://doi.org/10.1109/iciev.2014.6850681',
    isOpenAccess: false,
    citationText:
      'Tarannum, N., & Ahmed, N. (2014, May). Hybrid cloud infrastructure to handle large scale data for bangladesh people search (BDPS). In 2014 International Conference on Informatics, Electronics & Vision (ICIEV) (pp. 1-6). IEEE.',
    abstract:
      'The objective of our paper is to propose and experiment a hybrid Cloud computing framework which is able to handle huge data. Previously we proposed this architecture with adequate feasibility analysis. Here we discuss a prototype system using national ID database structure of Bangladesh which is prepared. We implemented and experimented each of the modules of the system prototype. The infrastructure of our proposed system divided into two parts: locally hosted cloud and remote cloud. Remote cloud is experimented with Elastic MapReduce (EMR) of Amazon Web Service (AWS) and “Eucalyptus” is justified for local cloud. This structure of cloud computing is handled by apache Hadoop map/reduce framework where database is implemented and experimented by HiveQL. An experimental analysis is presented in this paper. User information visibility, authorization, authentication and integrity issues are also discussed in our literature review.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 436); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iciev.2014.6850681.",
    },
  },
  {
    id: '2014-ifreephony-touchscreen-based-user-interface',
    title: 'Ifreephony: A touchscreen based user interface for people with visual impairment',
    authors: [
      { customAuthor: { name: 'Haque, A. M.' } },
      { customAuthor: { name: 'Nahar, F.' } },
      { customAuthor: { name: 'Ahmed, N.' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venue: 'iccit',
    citationText:
      'Haque, A. M., Nahar, F., & Ahmed, N. (2014). Ifreephony: A touchscreen based user interface for people with visual impairment. In Proceedings 17th International Conference on Computer and Information Technology (pp. 413-417).',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 432); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-ifreephony-touchscreen-based-user-interface-2',
    title: 'Ifreephony: A Touchscreen Based User Interface for People with Visual Impairment',
    authors: [
      { customAuthor: { name: 'A. M. Masudul Haque' } },
      { customAuthor: { name: 'Fajilatun Nahar' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venueLabel: '10th Global Engineering, Science and Technology Conference',
    citationText:
      'A. M. Masudul Haque, Fajilatun Nahar and Nova Ahmed (2014). Ifreephony: A Touchscreen Based User Interface for People with Visual Impairment. In 10th Global Engineering, Science and Technology Conference .',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 444); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-ifreephony-touchscreen-user-interface-people',
    title: 'ifreePhony: A touchscreen user interface for people with eye disability',
    authors: [
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Fajilatun Nahar' } },
      { customAuthor: { name: 'A. M. Masudul Haque' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venueLabel: 'Grace Hopper Conference, India',
    citationText:
      'Nova Ahmed Fajilatun Nahar, A. M. Masudul Haque (2014). ifreePhony: A touchscreen user interface for people with eye disability. InGrace Hopper Conference, India.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 438); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2014-implementation-flash-flood-monitoring-system',
    title:
      'Implementation of flash flood monitoring system based on wireless sensor network in Bangladesh',
    authors: [
      { customAuthor: { name: 'Md. Asraful Islam' } },
      { customAuthor: { name: 'Taoufikul Islam' } },
      { customAuthor: { name: 'Minhaz Ahmed Syrus' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venue: 'iciev',
    doi: '10.1109/iciev.2014.6850752',
    externalUrl: 'https://doi.org/10.1109/iciev.2014.6850752',
    isOpenAccess: false,
    citationText:
      'Islam, M. A., Islam, T., Syrus, M. A., & Ahmed, N. (2014, May). Implementation of flash flood monitoring system based on wireless sensor network in Bangladesh. In 2014 International Conference on Informatics, Electronics & Vision (ICIEV) (pp. 1-6). IEEE.',
    abstract:
      'This research involved in the design & implementation of water monitoring system that provides a solution to remotely monitoring water levels, early warning of events, sending notifications when critical water levels are reached through mobile and accessing all information via a website. It enables people to obtain readings remotely instead of having to travel to each monitoring stations to collect data and gives protection of the safety of monitoring personnel under certain dangerous circumstances. The system consists of the field sensor, Arduino Ethernet-shield, data collection software module, web console module, Mobile based monitoring module and distributed servers. The field sensor acquires the real-time data as water-level information from river stations. The data is then stored to distributed web servers and represented to website so that everyone gets the status of water levels. The proposed monitoring system presents useful characteristics as large network capacity, sensor hardware compatibility, long-range communication, low power consumption, and capable of taking challenge to natural environment threats like weather conditions and various type of water mixed up with others materials.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 422); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iciev.2014.6850752.",
    },
  },
  {
    id: '2014-protibadi-platform-fighting-sexual-harassment',
    title: 'Protibadi: A platform for fighting sexual harassment in urban Bangladesh',
    authors: [
      { customAuthor: { name: 'Syed Ishtiaque Ahmed' } },
      { customAuthor: { name: 'Steven J. Jackson' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Hasan Shahid Ferdous' } },
      { customAuthor: { name: 'Md. Rashidujjaman Rifat' } },
      { customAuthor: { name: 'A.S.M Rizvi' } },
      { customAuthor: { name: 'Shamir Ahmed' } },
      { customAuthor: { name: 'Rifat Sabbir Mansur' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venue: 'chi',
    doi: '10.1145/2556288.2557376',
    externalUrl: 'https://doi.org/10.1145/2556288.2557376',
    isOpenAccess: false,
    citationText:
      'Ahmed, S. I., Jackson, S. J., Ahmed, N., Ferdous, H. S., Rifat, M. R., Rizvi, A. S. M., ... & Mansur, R. S. (2014, April). Protibadi: A platform for fighting sexual harassment in urban Bangladesh. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (pp. 2695-2704).',
    abstract:
      'Public sexual harassment has emerged as a large and growing concern in urban Bangladesh, with deep and damaging implications for gender security, justice, and rights of public participation. In this paper we describe an integrated program of ethnographic and design work meant to understand and address such problems. For one year we conducted surveys, interviews, and focus groups around sexual harassment with women at three different universities in Dhaka. Based on this input, we developed "Protibadi", a web and mobile phone based application designed to report, map, and share women\'s stories around sexual harassment in public places. In August 2013 the system launched, user studies were conducted, and public responses were monitored to gauge reactions, strengths, and limits of the system. This paper describes the findings of our ethnographic and design-based work, and suggests lessons relevant to other HCI efforts to understand and design around difficult and culturally sensitive problems.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 418); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2556288.2557376.",
    },
  },
  {
    id: '2014-telemedicine-system-financially-unstable-people',
    title: 'Telemedicine System for Financially Unstable People of Bangladesh ',
    authors: [
      { customAuthor: { name: 'Rahat Yasir' } },
      { customAuthor: { name: 'Md. Shariful Islam Nibir' } },
      { customAuthor: { name: 'Zarmeen Ahmed Chadni' } },
      { customAuthor: { name: 'Nova Ahmed' } },
    ],
    year: 2014,
    status: 'published',
    type: 'conference',
    venueLabel: '10th Global Engineering, Science and Technology Conference',
    citationText:
      'Rahat Yasir, Md. Shariful Islam Nibir, Zarmeen Ahmed Chadni and Nova Ahmed (2104). Telemedicine System for Financially Unstable People of Bangladesh . In 10th Global Engineering, Science and Technology Conference.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 442); fields parsed from the citation text, no DOI or API match. Source citation prints the year as "2104"; year taken from the 2014 heading.',
    },
  },
  {
    id: '2013-gradient-sensor-middleware-system-design',
    title:
      'Gradient Sensor Middleware System design for Flash Flood prone River banks in Bangladesh',
    authors: [{ customAuthor: { name: 'Ahmed, N.' } }],
    year: 2013,
    status: 'published',
    type: 'conference',
    venueLabel: 'Grace Hopper Celebration for Women in Computing',
    citationText:
      'Ahmed, N. (2013). Gradient Sensor Middleware System design for Flash Flood prone River banks in Bangladesh. Grace Hopper Celebration for Women in Computing.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2013 heading, line 451); fields parsed from the citation text, no DOI or API match.',
    },
  },
  {
    id: '2013-mhealth-blood-donation-service-bangladesh',
    title: 'mHealth: Blood donation service in Bangladesh',
    authors: [
      { customAuthor: { name: 'A. H. M. Saiful Islam' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Kamrul Hasan' } },
      { customAuthor: { name: 'Md. Jubayer' } },
    ],
    year: 2013,
    status: 'published',
    type: 'conference',
    venue: 'iciev',
    doi: '10.1109/iciev.2013.6572594',
    externalUrl: 'https://doi.org/10.1109/iciev.2013.6572594',
    isOpenAccess: false,
    citationText:
      'Islam, A. S., Ahmed, N., Hasan, K., & Jubayer, M. (2013, May). mHealth: Blood donation service in Bangladesh. In 2013 International Conference on Informatics, Electronics and Vision (ICIEV) (pp. 1-6). IEEE.',
    abstract:
      'Communication technology has advanced significantly over the last decade enabling people to communicate anytime from anywhere using a multiplicity of devices. However, the power of this advancement in communication technology has hardly been leveraged in health care industry. The purpose of this paper is to develop a blood donation service to assist in the management of blood donor records and ease/or control the distribution of blood in various parts of the country basing on the demands. The blood donation service in Bangladesh offers functionality to quick access to donor records collected from various parts of the country. It enables monitoring of the results and performance of the blood donation activity.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2013 heading, line 449); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iciev.2013.6572594.",
    },
  },
  {
    id: '2012-adaptive-approach-video-streaming-evaluation',
    title: 'An Adaptive Approach for Video Streaming and Evaluation over Bluetooth Network',
    authors: [
      { customAuthor: { name: 'Rubaiyat Bin Sattar' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'Miftahur Rahman' } },
    ],
    year: 2012,
    status: 'published',
    type: 'conference',
    venueLabel:
      '2012 8th International Conference on Wireless Communications, Networking and Mobile Computing',
    doi: '10.1109/wicom.2012.6478392',
    externalUrl: 'https://doi.org/10.1109/wicom.2012.6478392',
    isOpenAccess: false,
    citationText:
      'Sattar, R. B., Ahmed, N., & Rahman, M. (2012, September). An adaptive approach for video streaming and evaluation over bluetooth network. In 2012 8th International Conference on Wireless Communications, Networking and Mobile Computing (pp. 1-4). IEEE.',
    abstract:
      'This paper provides a simulation based procedure for evaluating video streaming over Bluetooth v2.1 + Enhanced Data Rate (EDR) and Bluetooth v3 + High Speed (HS) specification. For more realistic simulation of audio video transmission over Bluetooth network two mechanisms have been proposed. These mechanisms can be applied over upcoming Bluetooth specification and in more advanced Bluetooth streaming research. The test bed is concerned on Quality of Service (QoS) by strict time manner, proper encoding method & packetizing. Proposed mechanisms compare Bluetooth EDR and HS with different video formats in Standard Piconet (1 master 7 slaves) topology and show the extraordinary performance of Bluetooth HS system. In large scale, streaming application of Bluetooth will bring enormous success in monitoring system.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2012 heading, line 462); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/wicom.2012.6478392.",
    },
  },
  {
    id: '2012-android-mobile-application-remote-monitoring',
    title: 'Android mobile application: Remote monitoring of blood pressure',
    authors: [
      { customAuthor: { name: 'Md. Kamrul Hasan' } },
      { customAuthor: { name: 'Nova Ahmed' } },
      { customAuthor: { name: 'A. H. M. Saiful Islam' } },
    ],
    year: 2012,
    status: 'published',
    type: 'conference',
    venue: 'iccit',
    doi: '10.1109/iccitechn.2012.6509753',
    externalUrl: 'https://doi.org/10.1109/iccitechn.2012.6509753',
    isOpenAccess: false,
    citationText:
      'Hasan, M. K., Ahmed, N., & Islam, A. S. (2012, December). Android mobile application: Remote monitoring of blood pressure. In 2012 15th International Conference on Computer and Information Technology (ICCIT) (pp. 215-220). IEEE.',
    abstract:
      "There has been an exponential increase in health care costs in the last decade. Seniors have to make frequent visits to their doctor to get their vital signs measured. There is a huge market for non-invasive methods of measurement of these vital signs. The objective of this paper is to design and implement a reliable, cheap, low powered, non-intrusive, and accurate system that can be worn on a regular basis and monitors the vital signs and displays the output to the user's cell phone. This paper specifically deals with the signal conditioning and data acquisition of vital sign: blood pressure. Blood pressure combines the methodologies of Electrocardiography to continuously monitor the systolic and diastolic blood pressure. Here remote monitoring of a patient's blood pressure (BP) is described. The data is transferred to a central monitoring station using a wireless sensor network for displaying and storing.",
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2012 heading, line 464); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1109/iccitechn.2012.6509753.",
    },
  },
  {
    id: '2012-middleware-systems-sensor-network-study',
    title: 'Middleware Systems for Sensor Network: A Study on Different Middleware Systems',
    authors: [{ customAuthor: { name: 'Nova Ahmed' } }],
    year: 2012,
    status: 'published',
    type: 'book-chapter',
    venueLabel: 'Wireless Sensor Networks and Energy Efficiency',
    doi: '10.4018/978-1-4666-0101-7.ch026',
    externalUrl: 'https://doi.org/10.4018/978-1-4666-0101-7.ch026',
    isOpenAccess: false,
    citationText:
      'Ahmed, N. (2012). Middleware Systems for Sensor Network: A Study on Different Middleware Systems. In Wireless Sensor Networks and Energy Efficiency: Protocols, Routing and Management (pp. 548-561). IGI Global.',
    abstract:
      'The middleware is a very important component in the wireless sensor network system. It has major challenges that are generic for any distributed systems as well as specific ones that are inherent to the physical nature of WSN systems due to the resource constraint nature. The author classifies WSN middleware systems as Event Based Middleware, System Abstraction Based Middleware, Application and Network Aware System, and Query Based Systems to gain a better understanding of such systems.',
    provenance: {
      source: 'crossref',
      sourceNote:
        "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2012 heading, line 472, also lines 470); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.4018/978-1-4666-0101-7.ch026.",
    },
  },
  {
    id: '2012-widespread-adoption-rfid-technology',
    title: 'Widespread adoption of RFID technology',
    authors: [{ customAuthor: { name: 'Ahmed, N.' } }],
    year: 2012,
    status: 'published',
    type: 'book-chapter',
    venueLabel:
      'Handbook of Research on Industrial Informatics and Manufacturing Intelligence: Innovations and Solutions (pp. 297-314). IGI Global',
    citationText:
      'Ahmed, N. (2012). Widespread adoption of RFID technology. In Handbook of research on industrial informatics and manufacturing intelligence: Innovations and solutions (pp. 297-314). IGI Global.',
    provenance: {
      source: 'scrape',
      sourceNote:
        'NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2012 heading, line 466); fields parsed from the citation text, no DOI or API match.',
    },
  },
]
