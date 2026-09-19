import type { Publication } from './types'

/**
 * Fixture publications: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const publications: Publication[] = [
  {
    id: "2026-google-maps-can-say-lot",
    title: "\"Google Maps can say a lot of things, but it cannot guide us properly\": Exploring Technology Inaccessibility for People with Visual Impairments in Bangladesh",
    authors: [
      {
        customAuthor: {
          name: "Eusra Amreen"
        }
      },
      {
        customAuthor: {
          name: "Mahir Morshed"
        }
      },
      {
        customAuthor: {
          name: "Ifti Azad Abeer"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2026,
    status: "published",
    type: "extended-abstract",
    venue: "chi",
    doi: "10.1145/3772363.3799021",
    externalUrl: "https://doi.org/10.1145/3772363.3799021",
    isOpenAccess: true,
    abstract: "Worldwide, people with visual impairments (PVI) face significant barriers in accessing technologies. These barriers exacerbated in low-resource contexts like Bangladesh due to infrastructural limitations. This paper explores the technology usage and preferences of n=7 tertiary-level students with visual impairments in Bangladesh. The study findings show that the technology-related challenges of PVIs include failure of assistive technologies. Participants shared that they face most inaccessibility while using Navigation technologies due to the infrastructural scenario of the country and lack of contextualization of those technologies. This research emphasizes the opportunity for the navigation technologies to better serve PVIs, particularly in regions with similar socio-technological challenges. This work presents the technology challenges and improvement suggestions of the participants, and outlines the need for participatory design research for more accessible and contextually aligned navigation technologies for this community.",
    provenance: {
      source: "orcid",
      sourceNote: "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3772363.3799021."
    }
  },
  {
    id: "2026-beyond-stigma-silence-multilayered-approach",
    title: "Beyond Stigma and Silence: A Multilayered Approach to Uncovering Mental Health Challenges Among People with Disabilities in Bangladesh Through Social Media Behavior and Linguistic Analytics",
    authors: [
      {
        customAuthor: {
          name: "Manoshi Das Turjo"
        }
      },
      {
        customAuthor: {
          name: "Md. Jahidul Islam"
        }
      },
      {
        customAuthor: {
          name: "Zinnat Fowzia Ria"
        }
      },
      {
        customAuthor: {
          name: "Hussain Md. Sahariyar"
        }
      },
      {
        customAuthor: {
          name: "Md Hasibur Rahman"
        }
      },
      {
        customAuthor: {
          name: "Mohammed Arif Uddin"
        }
      },
      {
        customAuthor: {
          name: "Anik Saha"
        }
      },
      {
        customAuthor: {
          name: "Salekul Islam"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2026,
    status: "preprint",
    type: "preprint",
    venueLabel: "JMIR Preprints",
    doi: "10.2196/preprints.105485",
    externalUrl: "https://doi.org/10.2196/preprints.105485",
    isOpenAccess: true,
    abstract: "BACKGROUND In Bangladesh, approximately 4.742 million individuals, or 2.4% of the population, live with physical or mental disabilities [19]. These individuals often face complex challenges that significantly affect their mental health and quality of life. According to the Centers for Disease Control and Prevention (CDC), adults with disabilities are five times more likely to experience frequent mental distress compared to their non-disabled peers [21]. The intersection of physical disability and mental health is multifaceted; navigating an environment not designed for their needs, experiencing societal stigma, managing chronic pain, and facing inaccessible infrastructure often contribute to emotional distress, anxiety, and depressive symptoms [20]. The mental health struggles of people with disabilities are often overlooked, especially in South Asian societies where mental illness is still stigmatized [1]. When these issues go unaddressed, they can worsen over time, affecting daily life, relationships, and overall quality of life [1]. Early diagnosis is crucial, but it requires a thoughtful, multi-layered approach to truly understand and support these individuals [2]. In Bangladesh, the social and structural environment is not yet responsive or inclusive enough to address these challenges, leaving many to suffer in silence [3]. Despite the urgent need for action, there is a lack of studies in South Asia that use innovative, scalable methods to understand the mental health of people with disabilities. In addition to physical barriers, persons with disabilities (PWDs) encounter significant societal challenges, including a prevailing culture that offers limited access to conventional employment. Despite the availability of workplace accommodations, many capable and willing PWDs still face restricted opportunities to participate in the workforce [24]. Mental health among PWDs remains an under-researched area, particularly in low- and middle-income countries (LMICs) like Bangladesh, where access to mental health services is limited and stigma remains pervasive [8]. Although mental health awareness has improved in Bangladesh in recent years, large-scale, data-driven studies focusing specifically on the psychological well-being of individuals with disabilities are notably scarce. Moreover, most national surveys and public health initiatives fail to disaggregate mental health data by disability status, resulting in limited visibility and support for this vulnerable group in both research and policy contexts [9]. While individuals with disabilities might feel hesitant to express their emotional distress in face-to-face interactions, they often turn to social media as a safer space for self-expression [4]. Important insights into their mental health can be gained through their online behavior, how they use language, their emotional tone, and how much they engage. Natural language processing (NLP) now offers a unique opportunity to analyze these online markers and detect signs of mental distress, such as depression or anxiety [5]. Different age groups experience depression and stress in distinct ways [14], and they handle these challenges differently. Gender also offers a massive reason for depression expressions [22] because males are found to have more precise forms of depression than females [23]. Furthermore, different situations tend to confront them; thus, the ways these issues are handled are also greatly diverse. For many people with disabilities, especially in resource-limited settings, formal mental health assessments are often inaccessible [6]. However, by analyzing their online traces [7], we can develop a cost-effective and scalable method to identify mental health risks. In this approach, the Patient Health Questionnaire-9 (PHQ-9) will be used as a psychometric scale to provide a validated measure of depression severity. The inclusion of the PHQ-9 will enhance the reliability of the digital mental health assessments, offering a robust validation for the data gathered from social media behavior. This combination improves the accuracy of the assessments and ensures that timely, evidence-based interventions can be implemented to make a meaningful impact on an individual's mental health. This study explores the mental health of individuals with disabilities in Bangladesh by analyzing their social media behavior [26] and qualitative interviews. These analyses are crucial as they offer a multifaceted understanding of mental health, particularly in individuals with disabilities, by combining clinical assessment tools with real-world social media data and thematic analysis of qualitative data. The PHQ-9 helps measure the severity of depression symptoms, providing clear insights into mental health. Emotional analysis, through sentiment analysis, uncovers underlying emotions like sadness or frustration in participants' responses. Linguistic analysis examines how word choices, such as pronouns and negations, reflect self-focus or emotional distance. NLP techniques, like zero-shot and few-shot learning, detect subtle emotional cues from text, even without explicit labels. While we conducted a qualitative interview to deep dive into understanding the problem. We collected direct data from the PWD participants, disability stigma in Bangladesh, and a very hard-to-reach community in this region. As a result, with limited quantitative data, we explored qualitative interviews to enrich the data and better understand the mental health of individuals with disabilities. Together, these methods create a richer understanding of mental health, merging clinical data with real-world emotional experiences. By analyzing language use, posting habits, and emotional tone, we combine computational analysis with psychometric tools to develop accessible and inclusive mental health surveillance methods for marginalized communities. To address these gaps, this study employs a two-phase mixed-methods design, integrating NLP-based computational analysis of social media language and behavior with standardized clinical assessment using the PHQ-9. Phase 1 draws on linguistic and sentiment patterns extracted from social media data to explore how people with disabilities express depression across gender and age groups. Phase 2 extends these insights through a structured survey, capturing symptom severity and behavioral patterns across a larger sample. Together, the two phases offer a layered understanding of depression that neither clinical tools nor computational methods could provide alone. Our goal is to contribute to a better understanding of mental health among people with disabilities, not just in Bangladesh, but across the Global South. OBJECTIVE The objective of this study is to understand how persons with disabilities (PWDs) in Bangladesh express and experience depression across gender and age groups, using social media behavior, linguistic analysis, and standardized clinical assessment as complementary lenses. The study aims to identify patterns in social media engagement, including usage frequency and emotional expression, and examine how these patterns relate to varying levels of mental distress [26]. In addition, the research will explore linguistic behaviors in the discussion with participants through the use of NLP techniques and sentiment analysis to characterize emotional and psychological states. The research hopes to find out how online behavior can reflect and influence the mental well-being of PWDs. METHODS This study employed a cross-sectional, non-probability design conducted across two phases of data collection. The first phase took place between October 30, 2024, and January 22, 2025, and the second phase extended from February 1 to June 14, 2025, yielding a combined sample of N=101 participants. Given the differing data modalities across the two phases, each cohort is described separately below, followed by an integrated overview of participant characteristics. Phase 1: Initial Cohort (N=20) —- Behavioral and Linguistic Analysis The first phase recruited 20 individuals with physical disabilities through purposive sampling [27], with assistance from key informants affiliated with disability support organizations across three major divisions of Bangladesh: Dhaka, Rajshahi, and Khulna. This phase adopted two complementary analytical approaches: (1) behavioral analysis of participants' social media usage patterns, incorporating PHQ-9 scores to examine associations with online activity; and (2) linguistic analysis employing natural language processing (NLP) techniques integrated with primary clinical measures to identify language-based indicators of depression, blending technical assessments with qualitative clinical insight. Data were collected through face-to-face semi-structured interviews conducted in the format of focus group discussions (FGDs) at participants' own locations. FGDs were prioritized as the primary qualitative method due to their capacity to encourage open dialogue and facilitate the authentic sharing of lived experiences. A total of five FGDs were conducted, with group sizes of 2, 7, 5, 4, and 4 participants respectively, supplemented by two individual interviews. All sessions were audio-recorded, transcribed in Bengali, and subsequently translated into English for analysis. In parallel, participants completed a structured online survey administered via a designated website linked to a Google Form, following established guidelines for transparent reporting of web-based surveys. This dual-method approach enabled triangulation of behavioral, linguistic, and self-reported clinical data. Eligible participants were required to be Bengali-speaking ad",
    provenance: {
      source: "orcid",
      sourceNote: "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2196/preprints.105485."
    }
  },
  {
    id: "2026-meena-needs-computer-now-co",
    title: "Meena Needs a Computer Now: Co-design Solutions to Barriers Using Fictional Inquiry for Women in Computing",
    authors: [
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Tasmiah Tahsin Mayeesha"
        }
      },
      {
        customAuthor: {
          name: "Ifti Azad Abeer"
        }
      },
      {
        customAuthor: {
          name: "Sumit Kumar Kar"
        }
      },
      {
        customAuthor: {
          name: "Anik Saha"
        }
      },
      {
        customAuthor: {
          name: "Anik Sinha"
        }
      },
      {
        customAuthor: {
          name: "Sumaya Akter Ruhi"
        }
      },
      {
        customAuthor: {
          name: "Md. Hussain Shahriar"
        }
      },
      {
        customAuthor: {
          name: "Sumaya Yasmin"
        }
      },
      {
        customAuthor: {
          name: "Nazmun Nahar"
        }
      },
      {
        customAuthor: {
          name: "Syeda Shabnam Khan"
        }
      }
    ],
    year: 2026,
    status: "published",
    type: "journal",
    venue: "tochi",
    doi: "10.1145/3762808",
    externalUrl: "https://doi.org/10.1145/3762808",
    isOpenAccess: true,
    featured: true,
    citationText: "Nova Ahmed, Tasmiah Tahsin, Ifti Azad Abeer, Sumit Kumar Kar, Anik Saha, Anik Sinha, Sumaya Akter Ruhi, Md. Hussain Shahriar, Sumaya Yasmin, Nazmun Nahar, and Syeda Shabnam. \"Meena Needs a Computer Now: Co-design Solutions to Barriers using Fictional Inquiry for Women in Computing.\" ACM Transactions on Computer-Human Interaction, Just Accepted (August 2025). https://doi.org/10.1145/3762808",
    abstract: "Gender disparity in computing is a well-explored concern. To complement existing research, we use a non-intrusive exploration method of Fictional Inquiry. Followed by co-design workshop to explore solution approaches to increase women’s participation in computing. The study involved n = 48 Women in Computing (WiC) students in computing from four universities across Bangladesh. Participants shared their challenges and desired solutions which we analyzed using qualitative methods along with Natural Language Processing based tools to illustrate the problems from various perspectives while minimizing potential biases. The research team reflects on methodological decisions, policy implications, and the need for culturally and contextually appropriate tools and datasets to better support WiC research in resource-limited settings.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 110); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3762808."
    }
  },
  {
    id: "2025-joyee-pcos-chatbot",
    title: "Joyee — A PCOS Chatbot",
    authors: [
      {
        customAuthor: {
          name: "Rubyda Hossain"
        }
      },
      {
        customAuthor: {
          name: "Rifah Nanjiba Khan"
        }
      },
      {
        customAuthor: {
          name: "Partha Sarathi Roy Chowdhury"
        }
      },
      {
        customAuthor: {
          name: "Syeda Madeha Mowla Manarat Huda"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2025,
    status: "published",
    type: "book-chapter",
    venueLabel: "Lecture Notes in Computer Science",
    doi: "10.1007/978-3-031-93236-6_13",
    externalUrl: "https://doi.org/10.1007/978-3-031-93236-6_13",
    isOpenAccess: false,
    provenance: {
      source: "orcid",
      sourceNote: "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1007/978-3-031-93236-6_13."
    }
  },
  {
    id: "2024-ai4bangladesh-ai-ethics-bangladesh-challenges",
    title: "AI4Bangladesh: AI Ethics for Bangladesh - Challenges, Risks, Principles, and Suggestions",
    authors: [
      {
        customAuthor: {
          name: "Tasmiah Tahsin Mayeesha"
        }
      },
      {
        customAuthor: {
          name: "Farzana Islam"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2024,
    status: "published",
    type: "conference",
    venue: "ictd",
    doi: "10.1145/3700794.3700820",
    externalUrl: "https://doi.org/10.1145/3700794.3700820",
    isOpenAccess: true,
    featured: true,
    citationText: "Tasmiah Tahsin Mayeesha, Farzana Islam, and Nova Ahmed. 2025. AI4Bangladesh: AI Ethics for Bangladesh - Challenges, Risks, Principles, and Suggestions. In Proceedings of the 13th International Conference on Information & Communication Technologies and Development (ICTD '24). Association for Computing Machinery, New York, NY, USA, 260–272. https://doi.org/10.1145/3700794.3700820",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2025 heading, line 98, also lines 115); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1145/3700794.3700820."
    }
  },
  {
    id: "2024-investigating-rhythmicity-app-usage-predict",
    title: "Investigating Rhythmicity in App Usage to Predict Depressive Symptoms: Protocol for Personalized Framework Development and Validation Through a Countrywide Study",
    authors: [
      {
        customAuthor: {
          name: "Md Sabbir Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Tanvir Hasan"
        }
      },
      {
        customAuthor: {
          name: "Salekul Islam"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2024,
    status: "published",
    type: "study-protocol",
    venue: "jmir-res-protoc",
    doi: "10.2196/51540",
    externalUrl: "https://doi.org/10.2196/51540",
    isOpenAccess: true,
    citationText: "Ahmed, Md Sabbir, Tanvir Hasan, Salekul Islam, and Nova Ahmed. \"Investigating Rhythmicity in App Usage to Predict Depressive Symptoms: Protocol for Personalized Framework Development and Validation Through a Countrywide Study.\" JMIR Research Protocols 13, no. 1 (2024): e51540.",
    abstract: "BACKGROUND: Understanding a student's depressive symptoms could facilitate significantly more precise diagnosis and treatment. However, few studies have focused on depressive symptom prediction through unobtrusive systems, and these studies are limited by small sample sizes, low performance, and the requirement for higher resources. In addition, research has not explored whether statistically significant rhythms based on different app usage behavioral markers (eg, app usage sessions) exist that could be useful in finding subtle differences to predict with higher accuracy like the models based on rhythms of physiological data. OBJECTIVE: The main objective of this study is to explore whether there exist statistically significant rhythms in resource-insensitive app usage behavioral markers and predict depressive symptoms through these marker-based rhythmic features. Another objective of this study is to understand whether there is a potential link between rhythmic features and depressive symptoms. METHODS: Through a countrywide study, we collected 2952 students' raw app usage behavioral data and responses to the 9 depressive symptoms in the 9-item Patient Health Questionnaire (PHQ-9). The behavioral data were retrieved through our developed app, which was previously used in our pilot studies in Bangladesh on different research problems. To explore whether there is a rhythm based on app usage data, we will conduct a zero-amplitude test. In addition, we will develop a cosinor model for each participant to extract rhythmic parameters (eg, acrophase). In addition, to obtain a comprehensive picture of the rhythms, we will explore nonparametric rhythmic features (eg, interdaily stability). Furthermore, we will conduct regression analysis to understand the association of rhythmic features with depressive symptoms. Finally, we will develop a personalized multitask learning (MTL) framework to predict symptoms through rhythmic features. RESULTS: After applying inclusion criteria (eg, having app usage data of at least 2 days to explore rhythmicity), we kept the data of 2902 (98.31%) students for analysis, with 24.48 million app usage events, and 7 days' app usage of 2849 (98.17%) students. The students are from all 8 divisions of Bangladesh, both public and private universities (19 different universities and 52 different departments). We are analyzing the data and will publish the findings in a peer-reviewed publication. CONCLUSIONS: Having an in-depth understanding of app usage rhythms and their connection with depressive symptoms through a countrywide study can significantly help health care professionals and researchers better understand depressed students and may create possibilities for using app usage-based rhythms for intervention. In addition, the MTL framework based on app usage rhythmic features may more accurately predict depressive symptoms due to the rhythms' capability to find subtle differences. INTERNATIONAL REGISTERED REPORT IDENTIFIER (IRRID): DERR1-10.2196/51540.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 137); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.2196/51540."
    }
  },
  {
    id: "2024-making-ethics-home-global-cs",
    title: "Making Ethics at Home in Global CS Education: Provoking Stories from the Souths",
    authors: [
      {
        customAuthor: {
          name: "Marisol Wong-Villacres"
        }
      },
      {
        customAuthor: {
          name: "Cat Kutay"
        }
      },
      {
        customAuthor: {
          name: "Shaimaa Lazem"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Cristina Abad"
        }
      },
      {
        customAuthor: {
          name: "Cesar Collazos"
        }
      },
      {
        customAuthor: {
          name: "Shady Elbassuoni"
        }
      },
      {
        customAuthor: {
          name: "Farzana Islam"
        }
      },
      {
        customAuthor: {
          name: "Deepa Singh"
        }
      },
      {
        customAuthor: {
          name: "Tasmiah Tahsin Mayeesha"
        }
      },
      {
        customAuthor: {
          name: "Martin Mabeifam Ujakpa"
        }
      },
      {
        customAuthor: {
          name: "Tariq Zaman"
        }
      },
      {
        customAuthor: {
          name: "Nicola J. Bidwell"
        }
      }
    ],
    year: 2024,
    status: "published",
    type: "journal",
    venue: "acm-jcss",
    doi: "10.1145/3608113",
    externalUrl: "https://doi.org/10.1145/3608113",
    isOpenAccess: true,
    abstract: "Despite the increase in university courses and curricula on the ethics of computing there are few studies about how computer science (CS) programs should account for the diverse ways ethical dilemmas and approaches to ethics are situated in cultural, philosophical, and governance systems, religions, and languages. We draw on the experiences and insights of 46 university educators and practitioners in Latin America, South-Asia, Africa, the Middle East, and Australian First Nations who participated in surveys and interviews. Our modest study seeks to prompt conversation about ethics and computing in the Global Souths and inform revisions to the Association of Computer Machinery's curricular guidelines for the Society, Ethics and Professionalism knowledge area in undergraduate CS programs. Participants describe frictions between static and anticipatory approaches to ethics in globalised regulations and formal codes of ethics and professional conduct and local practices, values, and impacts of technologies in the Global Souths. Codes and regulations are instruments for international control and their gap with local realities can cause harm, despite local efforts to compensate. However, our insights also illustrate opportunities for university teaching to link more closely to priorities, actions, and experiences in the Global Souths and enrich students’ education in the Global North.",
    provenance: {
      source: "orcid",
      sourceNote: "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3608113."
    }
  },
  {
    id: "2024-understanding-driving-stress-urban-bangladesh",
    title: "Understanding Driving Stress in Urban Bangladesh: An Exploratory Study, Wearable Development and Experiment",
    authors: [
      {
        customAuthor: {
          name: "Rahat Jahangir Rony"
        }
      },
      {
        customAuthor: {
          name: "Md. Sabbir Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Sayan Sarcar"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2024,
    status: "published",
    type: "journal",
    venue: "acm-jcss",
    doi: "10.1145/3648434",
    externalUrl: "https://doi.org/10.1145/3648434",
    isOpenAccess: true,
    citationText: "Rony, Rahat Jahangir, Md Sabbir Ahmed, Sayan Sarcar, and Nova Ahmed. \"Understanding driving stress in urban Bangladesh: An exploratory study, wearable development and experiment.\" ACM Journal on Computing and Sustainable Societies 2, no. 2 (2024): 1-28.",
    abstract: "Driving stress significantly impacts driving behavior primarily from roadside factors, where driving is more challenging in developing countries (i.e., Bangladesh) for unique cultural and infrastructural setups. We conduct an exploratory study (Qualitative n = 26, and Subjective Feedback n = 80) and a correlational analysis involving professional and private car drivers in urban Bangladesh. The study reveals drivers' demography and driving stress factors on the road. These findings motivate us to identify driving stress from physiological factors by developing a low-cost wearable, Stress Wear . This can detect stress from varying Heart Rates, validated by expensive commercial wearables. Between subject experiments on drivers (total n = 14 in two phases) with wearables, we also found that road factors are responsible for driving stress. Therefore, the developed system is helpful for these drivers to self-sense their stress.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2024 heading, line 129); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3648434."
    }
  },
  {
    id: "2023-fast-minimal-system-identify-depression",
    title: "A Fast and Minimal System to Identify Depression Using Smartphones: Explainable Machine Learning–Based Approach",
    authors: [
      {
        customAuthor: {
          name: "Md Sabbir Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2023,
    status: "published",
    type: "journal",
    venue: "jmir-form-res",
    doi: "10.2196/28848",
    externalUrl: "https://doi.org/10.2196/28848",
    isOpenAccess: true,
    abstract: "BACKGROUND: Existing robust, pervasive device-based systems developed in recent years to detect depression require data collected over a long period and may not be effective in cases where early detection is crucial. Additionally, due to the requirement of running systems in the background for prolonged periods, existing systems can be resource inefficient. As a result, these systems can be infeasible in low-resource settings. OBJECTIVE: Our main objective was to develop a minimalistic system to identify depression using data retrieved in the fastest possible time. Another objective was to explain the machine learning (ML) models that were best for identifying depression. METHODS: We developed a fast tool that retrieves the past 7 days' app usage data in 1 second (mean 0.31, SD 1.10 seconds). A total of 100 students from Bangladesh participated in our study, and our tool collected their app usage data and responses to the Patient Health Questionnaire-9. To identify depressed and nondepressed students, we developed a diverse set of ML models: linear, tree-based, and neural network-based models. We selected important features using the stable approach, along with 3 main types of feature selection (FS) approaches: filter, wrapper, and embedded methods. We developed and validated the models using the nested cross-validation method. Additionally, we explained the best ML models through the Shapley additive explanations (SHAP) method. RESULTS: Leveraging only the app usage data retrieved in 1 second, our light gradient boosting machine model used the important features selected by the stable FS approach and correctly identified 82.4% (n=42) of depressed students (precision=75%, F1-score=78.5%). Moreover, after comprehensive exploration, we presented a parsimonious stacking model where around 5 features selected by the all-relevant FS approach Boruta were used in each iteration of validation and showed a maximum precision of 77.4% (balanced accuracy=77.9%). Feature importance analysis suggested app usage behavioral markers containing diurnal usage patterns as being more important than aggregated data-based markers. In addition, a SHAP analysis of our best models presented behavioral markers that were related to depression. For instance, students who were not depressed spent more time on education apps on weekdays, whereas those who were depressed used a higher number of photo and video apps and also had a higher deviation in using photo and video apps over the morning, afternoon, evening, and night time periods of the weekend. CONCLUSIONS: Due to our system's fast and minimalistic nature, it may make a worthwhile contribution to identifying depression in underdeveloped and developing regions. In addition, our detailed discussion about the implication of our findings can facilitate the development of less resource-intensive systems to better understand students who are depressed and take steps for intervention.",
    provenance: {
      source: "orcid",
      sourceNote: "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.2196/28848."
    }
  },
  {
    id: "2023-mfs-design-appstore-enabled-smart",
    title: "MFS Design in Appstore-enabled Smart Featurephones for Low-literate, Marginalized Communities",
    authors: [
      {
        customAuthor: {
          name: "Mohammad Rayed"
        }
      },
      {
        customAuthor: {
          name: "Tawfique Elahi"
        }
      },
      {
        customAuthor: {
          name: "Shaikh Shawon Arefin Shimon"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2023,
    status: "published",
    type: "conference",
    venue: "chi",
    doi: "10.1145/3544548.3580661",
    externalUrl: "https://doi.org/10.1145/3544548.3580661",
    isOpenAccess: false,
    featured: true,
    abstract: "Mobile Financial Services (MFS) has gained significant popularity during the COVID-19 pandemic, especially among marginalized and low-income, low-literate communities around the world. Such communities have not been traditionally considered while designing MFS services via smartphone apps or USSD services in featurephones. Financial constraints limit such end-users towards basic featurephones, where recent appstore support has made it possible to deploy app-based MFS solutions beyond USSD. This new featurephone platform is a relatively underexplored area in terms of addressing design issues related to aforementioned end-users while developing MFS solutions. Our work addresses this gap by presenting qualitative findings on barriers to technology access focused on MFS solutions in marginal communities. We present a prototype non-USSD, app-based solution on an appstore-supported featurephone platform designed via a human-centered approach. This work has the potential to increase the financial inclusivity of marginalized communities in cashless MFS transactions via low-cost, appstore-enabled featurephones.",
    provenance: {
      source: "orcid",
      sourceNote: "Nova Ahmed's ORCID (0000-0002-7715-1742); not on the NSU publications page. Metadata from Crossref/OpenAlex for DOI 10.1145/3544548.3580661."
    }
  },
  {
    id: "2022-hci-knowledge-dissemination-south-asia",
    title: "HCI Knowledge Dissemination in South Asia through both Coursework and Community Engagement",
    authors: [
      {
        customAuthor: {
          name: "Jain, Pranjal"
        }
      },
      {
        customAuthor: {
          name: "Anirudh Nagraj"
        }
      },
      {
        customAuthor: {
          name: "Kartik Joshi"
        }
      },
      {
        customAuthor: {
          name: "Taru Jain"
        }
      },
      {
        customAuthor: {
          name: "Dilrukshi Gamage"
        }
      },
      {
        customAuthor: {
          name: "Sayan Sarcar"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2022,
    status: "published",
    citationText: "Jain, Pranjal, Anirudh Nagraj, Kartik Joshi, Taru Jain, Dilrukshi Gamage, Sayan Sarcar, and Nova Ahmed. \"HCI Knowledge Dissemination in South Asia through both Coursework and Community Engagement.\" (2022).",
    provenance: {
      source: "scrape",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 184); fields parsed from the citation text, no DOI or API match."
    }
  },
  {
    id: "2022-impact-socio-economic-factors-female",
    title: "Impact of socio-economic factors on female students’ enrollments in science, technology, engineering and mathematics and workplace challenges in Bangladesh",
    authors: [
      {
        customAuthor: {
          name: "Ahmed, Nova"
        }
      },
      {
        customAuthor: {
          name: "Arshad M. Chowdhury"
        }
      },
      {
        customAuthor: {
          name: "Tamanna Urmi"
        }
      },
      {
        customAuthor: {
          name: "Lafifa Jamal"
        }
      }
    ],
    year: 2022,
    status: "published",
    type: "journal",
    venueLabel: "American Behavioral Scientist",
    citationText: "Ahmed, Nova, Arshad M. Chowdhury, Tamanna Urmi, and Lafifa Jamal. \"Impact of socio-economic factors on female students’ enrollments in science, technology, engineering and mathematics and workplace challenges in Bangladesh.\" American Behavioral Scientist (2022): 00027642221078517.",
    provenance: {
      source: "scrape",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 186); fields parsed from the citation text, no DOI or API match."
    }
  },
  {
    id: "2022-less-more-leveraging-digital-behavioral",
    title: "Less Is More: Leveraging Digital Behavioral Markers for Real-Time Identification of Loneliness in Resource-Limited Settings",
    authors: [
      {
        customAuthor: {
          name: "Ahmed, Md Sabbir"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2022,
    status: "published",
    type: "conference",
    venue: "pervasivehealth",
    citationText: "Ahmed, Md Sabbir, and Nova Ahmed. \"Less Is More: Leveraging Digital Behavioral Markers for Real-Time Identification of Loneliness in Resource-Limited Settings.\" (2022). Presented at: EAI PervasiveHealth 2022 - 16th EAI International Conference on Pervasive Computing Technologies for Healthcare, Thessaloniki, Greece, 12-14 December 2022.",
    provenance: {
      source: "scrape",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2022 heading, line 162); fields parsed from the citation text, no DOI or API match."
    }
  },
  {
    id: "2021-understanding-self-reported-stress-among",
    title: "Understanding self-reported stress among drivers and designing stress monitor using heart rate variability",
    authors: [
      {
        customAuthor: {
          name: "Ahmed, N."
        }
      },
      {
        customAuthor: {
          name: "Rony, R. J."
        }
      }
    ],
    year: 2021,
    status: "published",
    type: "journal",
    venueLabel: "Quality and User Experience, 6(1), 1-21",
    citationText: "Ahmed, N., & Rony, R. J. (2021). Understanding self-reported stress among drivers and designing stress monitor using heart rate variability.Quality and User Experience, 6(1), 1-21.",
    provenance: {
      source: "scrape",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 201); fields parsed from the citation text, no DOI or API match."
    }
  },
  {
    id: "2021-i-didnt-understand-but-i",
    title: "“I didn’t understand but I was determined to learn”: Understanding the Contrast of using DFS among the Working Women in Bangladesh",
    authors: [
      {
        customAuthor: {
          name: "Rony, R. J."
        }
      },
      {
        customAuthor: {
          name: "Khan, S. S."
        }
      },
      {
        customAuthor: {
          name: "Sinha, A."
        }
      },
      {
        customAuthor: {
          name: "Saha, A."
        }
      },
      {
        customAuthor: {
          name: "Ahmed, N."
        }
      }
    ],
    year: 2021,
    status: "published",
    type: "workshop",
    venue: "hcixb",
    citationText: "Rony, R. J., Khan, S. S., Sinha, A., Saha, A., and Ahmed, N. 2021. “I didn’t understand but I was determined to learn”: Understanding the Contrast of using DFS among the Working Women in Bangladesh.Human Computer Interaction Across the Border Symposium. CHI 2021.",
    provenance: {
      source: "scrape",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2021 heading, line 203); fields parsed from the citation text, no DOI or API match."
    }
  },
  {
    id: "2020-understanding-educational-landscape-children-autism",
    title: "Understanding the Educational Landscape of Children with Autism in Bangladesh",
    authors: [
      {
        customAuthor: {
          name: "Hridi, Anurata Prabha"
        }
      },
      {
        customAuthor: {
          name: "Shameem Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Ifti Azad Abeer"
        }
      },
      {
        customAuthor: {
          name: "Anik Saha"
        }
      },
      {
        customAuthor: {
          name: "Anik Sinha"
        }
      },
      {
        customAuthor: {
          name: "Mohammad Sorowar Hossain"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Moushumi Sharmin"
        }
      }
    ],
    year: 2020,
    status: "published",
    type: "conference",
    venueLabel: "International Conference on Information (iConference 2020), pp. 441-455. Springer, Cham",
    citationText: "Hridi, Anurata Prabha, Shameem Ahmed, Ifti Azad Abeer, Anik Saha, Anik Sinha, Mohammad Sorowar Hossain, Nova Ahmed, and Moushumi Sharmin. Understanding the Educational Landscape of Children with Autism in Bangladesh. In International Conference on Information, pp. 441-455. Springer, Cham, 2020.",
    provenance: {
      source: "scrape",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2020 heading, line 224); fields parsed from the citation text, no DOI or API match."
    }
  },
  {
    id: "2019-they-dont-leave-us-alone",
    title: "\"They Don't Leave Us Alone Anywhere We Go\": Gender and Digital Abuse in South Asia",
    authors: [
      {
        customAuthor: {
          name: "Nithya Sambasivan"
        }
      },
      {
        customAuthor: {
          name: "Amna Batool"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Tara Matthews"
        }
      },
      {
        customAuthor: {
          name: "Kurt Thomas"
        }
      },
      {
        customAuthor: {
          name: "Laura Sanely Gaytán-Lugo"
        }
      },
      {
        customAuthor: {
          name: "David Nemer"
        }
      },
      {
        customAuthor: {
          name: "Elie Bursztein"
        }
      },
      {
        customAuthor: {
          name: "Elizabeth Churchill"
        }
      },
      {
        customAuthor: {
          name: "Sunny Consolvo"
        }
      }
    ],
    year: 2019,
    status: "published",
    type: "conference",
    venue: "chi",
    doi: "10.1145/3290605.3300232",
    externalUrl: "https://doi.org/10.1145/3290605.3300232",
    isOpenAccess: true,
    featured: true,
    citationText: "Sambasivan, N., Batool, A., Ahmed, N., Matthews, T., Thomas, K., Gaytán-Lugo, L.S., Nemer, D., Bursztein, E., Churchill, E. and Consolvo, S., 2019, May. They Don't Leave Us Alone Anywhere We Go\" Gender and Digital Abuse in South Asia. In proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (pp. 1-14). (Best of CHI 2019)",
    abstract: "South Asia faces one of the largest gender gaps online globally, and online safety is one of the main barriers to gender-equitable Internet access [GSMA, 2015]. To better understand the gendered risks and coping practices online in South Asia, we present a qualitative study of the online abuse experiences and coping practices of 199 people who identified as women and 6 NGO staff from India, Pakistan, and Bangladesh, using a feminist analysis. We found that a majority of our participants regularly contended with online abuse, experiencing three major abuse types: cyberstalking, impersonation, and personal content leakages. Consequences of abuse included emotional harm, reputation damage, and physical and sexual violence. Participants coped through informal channels rather than through technological protections or law enforcement. Altogether, our findings point to opportunities for designs, policies, and algorithms to improve women's safety online in South Asia.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 245); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3290605.3300232. Citation notes \"Best of CHI 2019\"."
    }
  },
  {
    id: "2019-development-digital-family-stories-bangladesh",
    title: "Development through digital family stories in Bangladesh",
    authors: [
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Farlina Barik"
        }
      },
      {
        customAuthor: {
          name: "Zareen Tasnim"
        }
      },
      {
        customAuthor: {
          name: "Jasmine Jones"
        }
      }
    ],
    year: 2019,
    status: "published",
    type: "conference",
    venue: "ictd",
    doi: "10.1145/3287098.3287136",
    externalUrl: "https://doi.org/10.1145/3287098.3287136",
    isOpenAccess: false,
    citationText: "Ahmed, N., Barik, F., Tasnim, Z., & Jones, J. (2019, January). Development through digital family stories in Bangladesh. In Proceedings of the Tenth International Conference on Information and Communication Technologies and Development (pp. 1-5).",
    abstract: "Bangladesh has a rich history of storytelling for cultural, historical, social, and personal memories. Family stories in particular are powerful ways to reflect on relationships along with social values in a particular snapshot of time. Our goal is to derive insights for the design of culturally and value-sensitive digital storytelling tools for families in Bangladesh to preserve and share their stories. This paper describes ongoing work to understand the kinds of stories people tell, as well as the experience of listening to recorded stories.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 283); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3287098.3287136."
    }
  },
  {
    id: "2019-digital-silence-liberating-stories-during",
    title: "Digital Silence and Liberating Stories: During a Student-Driven Movement",
    authors: [
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Zareen Tasnim"
        }
      },
      {
        customAuthor: {
          name: "Jasmine Jones"
        }
      }
    ],
    year: 2019,
    status: "published",
    type: "extended-abstract",
    venue: "chi",
    doi: "10.1145/3290607.3310418",
    externalUrl: "https://doi.org/10.1145/3290607.3310418",
    isOpenAccess: false,
    citationText: "Ahmed, N., Tasnim, Z., & Jones, J. (2019, May). Digital Silence and Liberating Stories: During a Student-Driven Movement. In Extended Abstracts of the 2019 CHI Conference on Human Factors in Computing Systems (pp. 1-10).",
    abstract: "In August 2018, a student protest initiated in Bangladesh sought justice when two school students were run over by public bus. Student protesters were demonstrating on the street for days until they were physically attacked. Concurrent with the physical attacks, the country experienced a disconnect. Internet, restrictions on social media usage, and several high-profile arrests of people speaking about the incidents. These suppressive encounters created what we call a \"digital silence.\" In response, we collected stories from people, which depict their effort to seek out information about the events unfolding and share their perspective of what happened. Through these in-the-moment stories, we see a glimpse of how the information suppression impacted people with varying proximity to the events, including protesters, bystanders, and family members. We also reflect on the benefit of the subtle defiance of storytelling for storytellers in the midst of this social justice effort.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 279); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/3290607.3310418."
    }
  },
  {
    id: "2019-managing-autism-spectrum-disorder-developing",
    title: "Managing autism spectrum disorder in developing countries by utilizing existing resources: A perspective from Bangladesh",
    authors: [
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Enayetur Raheem"
        }
      },
      {
        customAuthor: {
          name: "Nusrat Rahman"
        }
      },
      {
        customAuthor: {
          name: "Muhammad Zillur Rahman Khan"
        }
      },
      {
        customAuthor: {
          name: "Abdullah Al Mosabbir"
        }
      },
      {
        customAuthor: {
          name: "Mohammad Sorowar Hossain"
        }
      }
    ],
    year: 2019,
    status: "published",
    type: "journal",
    venueLabel: "Autism",
    doi: "10.1177/1362361318773981",
    externalUrl: "https://doi.org/10.1177/1362361318773981",
    isOpenAccess: false,
    citationText: "Ahmed, N., Raheem, E., Rahman, N., Khan, M. Z. R., Mosabbir, A. A., & Hossain, M. S. (2019). Managing autism spectrum disorder in developing countries by utilizing existing resources: A perspective from Bangladesh.Autism, 23(3), 801-803.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 249); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1177/1362361318773981."
    }
  },
  {
    id: "2019-monitoring-driving-stress-hrv",
    title: "Monitoring Driving Stress using HRV",
    authors: [
      {
        customAuthor: {
          name: "Rahat Jahangir Rony"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      }
    ],
    year: 2019,
    status: "published",
    type: "conference",
    venue: "comsnets",
    doi: "10.1109/comsnets.2019.8711411",
    externalUrl: "https://doi.org/10.1109/comsnets.2019.8711411",
    isOpenAccess: false,
    citationText: "Rony, R. J., & Ahmed, N. 2019. Monitoring Driving Stress using HRV. IEEE 11th International Conference on COMmunication Systems & NETworkS 2019 (COMSNETS). DOI: 10.1109/COMSNETS.2019.8711411(Best Poster COMSNETS 2019)",
    abstract: "Driving stress is responsible for bad driving behavior and fatal accidents. This stress initiates from road factors and keeps negative consequences in overall traffic management as well as in transportation system. Bangladesh has poor road infrastructure, environment and management. We explore to know the Bangladeshi drivers stress level through HRV by developing a system. This system helps the drivers to manage their stress by creating self-awareness among the drivers regarding overall road safety.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2019 heading, line 247); DOI stated in the NSU citation; metadata from Crossref/OpenAlex for DOI 10.1109/comsnets.2019.8711411. Citation notes \"Best Poster COMSNETS 2019\"."
    }
  },
  {
    id: "2018-supporting-missing-daughters",
    title: "Supporting Missing Daughters",
    authors: [
      {
        customAuthor: {
          name: "Ahmed, N."
        }
      },
      {
        customAuthor: {
          name: "Motahar, T."
        }
      },
      {
        customAuthor: {
          name: "Kabir, S."
        }
      },
      {
        customAuthor: {
          name: "Hasan, M."
        }
      }
    ],
    year: 2018,
    status: "published",
    type: "workshop",
    venue: "hcixb",
    citationText: "Ahmed, N., Motahar, T., Kabir, S. and Hasan, M. (2018). Supporting Missing Daughters, HCI Across Borders, CHI 2018. [Best Poster Award]",
    provenance: {
      source: "scrape",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2018 heading, line 298); fields parsed from the citation text, no DOI or API match. Citation notes a Best Poster Award."
    }
  },
  {
    id: "2014-protibadi-platform-fighting-sexual-harassment",
    title: "Protibadi: A platform for fighting sexual harassment in urban Bangladesh",
    authors: [
      {
        customAuthor: {
          name: "Syed Ishtiaque Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Steven J. Jackson"
        }
      },
      {
        customAuthor: {
          name: "Nova Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Hasan Shahid Ferdous"
        }
      },
      {
        customAuthor: {
          name: "Md. Rashidujjaman Rifat"
        }
      },
      {
        customAuthor: {
          name: "A.S.M Rizvi"
        }
      },
      {
        customAuthor: {
          name: "Shamir Ahmed"
        }
      },
      {
        customAuthor: {
          name: "Rifat Sabbir Mansur"
        }
      }
    ],
    year: 2014,
    status: "published",
    type: "conference",
    venue: "chi",
    doi: "10.1145/2556288.2557376",
    externalUrl: "https://doi.org/10.1145/2556288.2557376",
    isOpenAccess: false,
    citationText: "Ahmed, S. I., Jackson, S. J., Ahmed, N., Ferdous, H. S., Rifat, M. R., Rizvi, A. S. M., ... & Mansur, R. S. (2014, April). Protibadi: A platform for fighting sexual harassment in urban Bangladesh. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (pp. 2695-2704).",
    abstract: "Public sexual harassment has emerged as a large and growing concern in urban Bangladesh, with deep and damaging implications for gender security, justice, and rights of public participation. In this paper we describe an integrated program of ethnographic and design work meant to understand and address such problems. For one year we conducted surveys, interviews, and focus groups around sexual harassment with women at three different universities in Dhaka. Based on this input, we developed \"Protibadi\", a web and mobile phone based application designed to report, map, and share women's stories around sexual harassment in public places. In August 2013 the system launched, user studies were conducted, and public responses were monitored to gauge reactions, strengths, and limits of the system. This paper describes the findings of our ethnographic and design-based work, and suggests lessons relevant to other HCI efforts to understand and design around difficult and culturally sensitive problems.",
    provenance: {
      source: "crossref",
      sourceNote: "NSU publications page labs/dial/scraped-data/nsu-hci-current-website/publications.md (2014 heading, line 418); title-matched to Nova Ahmed's ORCID; metadata from Crossref/OpenAlex for DOI 10.1145/2556288.2557376."
    }
  }
]
