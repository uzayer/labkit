# DIAL publication, Venue, and Organization candidates from public scrapes

## Scope and handling rules

This is an evidence-preserving staging document, not an approved import. It
maps only what the two captured public sites state into the current LabKit
`Publication`, `Venue`, and `Organization` contract. A **Publication** is a
single research output; a **Venue** is where it appeared; an **Organization**
is an external institution, funder, or publisher. Do not turn source
abbreviations, `et al.`, initials, or partial names into Team Members without a
separate safe match.

Primary source: `../scraped-data/nsu-hci-current-website/publications.md` (2026-09-12 capture), heading
**List of Publications**, year subheadings **2025**, **2024**, **2022**,
**2021**, **2020**, **2019**, **2018**, **2017**, **2016**, **2015**, **2014**,
**2013**, and **2012**. It contains 172 listed citations (including the two
explicit repeats described below). Each listed bullet is an individual
Publication candidate. Its full `citationText` is the citation verbatim in that
source under its named year heading; its `authors[]` must retain the source
author segment and ordering exactly, with one `customAuthor.name` per author
until a Team Member can be safely matched. This avoids silently expanding
initials such as `N. Ahmed` into a person identity.

The source provides no abstract, keywords, publication date (except incidental
month text), affiliation, license, or reliable open-access status for the
catalogue. Those fields are unknown. `status` is `published` unless the source
literally says **Accepted**, **Just Accepted**, or **In Press**; then retain the
source status text for human review rather than assuming publication. `type` is
only a candidate inferred from the cited container: proceedings/conference or
symposium -> `conference`; _Extended Abstracts_, companion, demo, poster, or
adjunct -> `extended-abstract`; a named periodical -> `journal`; arXiv/SSRN ->
`preprint`; handbook/book chapter -> `book-chapter`. Everything else is
unknown. No source provides an Organization affiliation for an author.

The public catalogue's Google Scholar links are person-profile URLs, not
Publication URLs: Nova Ahmed; Tamanna Motahar; Rahat Jahangir Rony; Anik Saha;
Anik Sinha; Ifti Azad Abeer (same source, heading **Google Scholar**). Do not
store them in a Publication's `externalUrl` or `pdf.link`.

## Catalogue-to-schema mapping

For every individual citation in the primary source, create one candidate with
these values only when they occur in the cited text:

| Source evidence                                      | Candidate field(s)                                             | Handling                                                                                                           |
| ---------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Citation's title sentence                            | `title`                                                        | Preserve punctuation/capitalization as displayed; repair nothing in staging.                                       |
| Citation's author segment, left-to-right             | `authors[].customAuthor.name`, `authorPosition`                | Preserve spelling, initials, order, and literal `et al.`/ellipsis. The latter needs human expansion before import. |
| Year or incidental month/year                        | `year`; possible `publicationDate`                             | Store year; do not manufacture a day/date from a month.                                                            |
| Named proceedings/journal/conference                 | `venueLabel`; optional `venue`                                 | Use the exact source string as `venueLabel`; link only after resolving the candidate Venue below.                  |
| `vol.`, `no.`, `pp.`                                 | `volume`, `issue`, `pageStart`, `pageEnd`                      | Transcribe only explicit values.                                                                                   |
| `DOI`/`doi.org` textual identifier                   | `doi` and `externalUrl: https://doi.org/<doi>`                 | The DOI is source-stated, not inferred from the title.                                                             |
| Explicit http(s) link labelled PDF/preprint/abstract | `pdf: { type: link, link: <exact URL> }`                       | Keep Google redirect and tokenized URLs as raw evidence; do not substitute a guessed canonical URL.                |
| Named publisher in citation                          | `publisher` free text; possible Venue `publisher` relationship | Resolve the Organization only after review.                                                                        |

### Direct DOI / URL candidates in the catalogue

These have a source-stated DOI or external page and can populate a link without
web enrichment. Every row's source citation text is the exact primary-source
bullet at the indicated heading/line.

| Publication candidate (title)                                                                                                                       | Year heading  | DOI / source-stated URL                                                                                                | Venue candidate                                                                                                         | Evidence                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Behind the White Coat: Understanding the Mental and Physical Burdens of Doctors and Support Interventions in Bangladesh: A Qualitative Study        | 2025          | `10.2196/76934`                                                                                                        | Interactive Journal of Medical Research / JMIR (conflicting presentation)                                               | `publications.md`, **2025**, line 96                      |
| AI4Bangladesh: AI Ethics for Bangladesh - Challenges, Risks, Principles, and Suggestions                                                            | 2025 and 2024 | `10.1145/3700794.3700820`                                                                                              | Proceedings of the 13th International Conference on Information & Communication Technologies and Development (ICTD '24) | same, **2025** line 98; duplicate under **2024** line 115 |
| Implications of Mobile Financial Service Users' Adaptive Usage Behavior: The Vicious Cycle of Negative Experience, Social Construct, and Confidence | 2025          | `10.1145/3723041`                                                                                                      | ACM Journal on Computing and Sustainable Societies                                                                      | same, **2025**, line 104                                  |
| The Necessary Ingredients for Success of Women in Computing: A 360° Perspective from Students, Professionals and Stakeholders                       | 2025          | `10.1145/3724502`                                                                                                      | ACM J. Comput. Sustain. Soc.                                                                                            | same, **2025**, line 106                                  |
| Jalli: System level support for critical real-time applications                                                                                     | 2025          | `10.1145/3715335.3744891`                                                                                              | ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies / COMPASS ’25                                       | same, **2025**, line 108                                  |
| Meena Needs a Computer Now: Co-design Solutions to Barriers using Fictional Inquiry for Women in Computing                                          | 2025          | `10.1145/3762808`                                                                                                      | ACM Transactions on Computer-Human Interaction                                                                          | same, **2025**, line 110                                  |
| Risk Communication during COVID-19 Pandemic: Impacting Women in Bangladesh                                                                          | 2022          | `10.3389/fcomm.2022.878050`                                                                                            | Frontiers in Communication: Disaster Communications                                                                     | same, **2022**, line 146                                  |
| “I Use YouTube Now in COVID”: Understanding Technology Adoption of Indigenous Communities during COVID-19 Pandemic in Bangladesh                    | 2022          | `10.1145/3530190.3534847`; publisher page `https://compass22.hotcrp.com/paper/250?cap=hcav250cNoEmEgQeoihAmSDofCBpENa` | ACM SIGCAS Conference on Computing and Sustainable Societies (COMPASS)                                                  | same, **2022**, line 152                                  |
| Identifying High and Low Academic Result Holders Through Smartphone Usage Data                                                                      | 2021          | `10.1145/3429360.3468192`                                                                                              | AsianCHI Symposium / CHI 2021                                                                                           | same, **2021**, line 197                                  |
| Development of a Low-Cost Wearable with Mobile Sensing to Monitor Driving Stress using HRV                                                          | 2020          | `10.1145/3391203.3391213`                                                                                              | Asian CHI 2020 Symposium                                                                                                | same, **2020**, line 228                                  |
| Kotha Bondhu: Translating Sign Languages into Bengali Voice                                                                                         | 2020          | `10.1145/3391203.3391208`                                                                                              | Asian CHI 2020 Symposium                                                                                                | same, **2020**, line 232                                  |
| Monitoring Driving Stress using HRV                                                                                                                 | 2019          | `10.1109/COMSNETS.2019.8711411`                                                                                        | IEEE 11th International Conference on COMmunication Systems & NETworkS (COMSNETS)                                       | same, **2019**, line 247                                  |
| A Low-cost Healthcare Bot for Elderly People                                                                                                        | 2019          | `10.1109/ICIEV.2019.8858567`                                                                                           | IEEE 8th International Conference on Informatics, Electronics & Vision (ICIEV)                                          | same, **2019**, line 271                                  |
| Reinforcement based learning through communicative Android app for autism personnel                                                                 | 2018          | `10.1145/3236112.3236131`; ResearchGate redirect URL is source-stated                                                  | Proceedings of the 20th International Conference on Human-Computer Interaction with Mobile Devices and Services Adjunct | same, **2018**, line 302                                  |
| How Well Our Drivers on Road?: Discomfort is Obvious in Drivers Daily Life                                                                          | 2018          | `10.1145/3267305.3277809`                                                                                              | UbiComp/ISWC 2018 Adjunct                                                                                               | same, **2018**, line 308                                  |
| Mini Nurse-Bot: A Healthcare Assistance for Elderly People                                                                                          | 2018          | `10.1145/3267305.3267662`                                                                                              | UbiComp Demos / UbiComp/ISWC 2018 Adjunct                                                                               | same, **2018**, line 310                                  |

## Additional individual Publication candidates on the personal site

These are the personal site's cited works that are not present as a full,
matching bibliographic candidate in the primary catalogue, or that add a
source-stated URL/DOI/status. Quoted text is the complete source citation text;
authors are ordered exactly as quoted. A link is a `pdf.link` only where the
source labelled it PDF/preprint; a DOI link is `externalUrl` plus `doi`.

### Project pages: currently distinct candidates

**Women on the web: challenges, persistence, and resilience** — candidate:
`year: 2021`; `type: journal`; `venueLabel: XRDS: Crossroads, The ACM Magazine
for Students`; `volume: 27`; `issue: 3`; `pageStart: 8`; `pageEnd: 9`;
authors `["Ahmed, N.", "Churchill, E."]`; `doi: 10.1145/3452925` and
`externalUrl: https://dl.acm.org/doi/fullHtml/10.1145/3452925`.

> Ahmed, N., & Churchill, E. (2021). Women on the web: challenges, persistence, and resilience. XRDS: Crossroads, The ACM Magazine for Students, 27(3), 8-9. [Digital Edition](https://dl.acm.org/doi/fullHtml/10.1145/3452925)

Evidence: `nova-ahmed-personal-site/research-protibadi.md`, heading **Protibadi**, **Publication**.

**Design of Low-Cost Smart Safety Vest for the Prevention of Physical Abuse and
Sexual Harassment** — candidate: `year: 2021`; `type: conference`;
`venueLabel: 2021 24th International Conference on Computer and Information
Technology (ICCIT)`; `publisher: IEEE`; `pageStart: 1`; `pageEnd: 6`; authors
`["Turjo, Kazi Rumman Reswan", "Partho Anthony D’Costa", "Surjo Bhowmick",
"Asadullah Galib", "Sami Raian", "Mst Shapna Akter", "Nova Ahmed", "M. R.
C. Mahdy"]`; DOI/URL unknown.

> Turjo, Kazi Rumman Reswan, Partho Anthony D’Costa, Surjo Bhowmick, Asadullah Galib, Sami Raian, Mst Shapna Akter, Nova Ahmed, and M. R. C. Mahdy. "Design of Low-Cost Smart Safety Vest for the Prevention of Physical Abuse and Sexual Harassment." In 2021 24th International Conference on Computer and Information Technology (ICCIT), pp. 1-6. IEEE, 2021.

Evidence: `nova-ahmed-personal-site/research-protibadi.md`, heading **Protibadi**, **Publication**.

**My Mom took My Phone and Locked It in the Wardrobe: Parental Mediation in
Teen-Parent Relationship in Technology Usage from Teens Perspective in
Bangladesh** — candidate: `year: 2021`; `status: preprint`; `type: preprint`;
`venueLabel: SSRN`; `externalUrl: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4000430`;
authors `["Rony, R. J.", "Ahmed, N."]`; DOI unknown.

> Rony, R. J., & Ahmed, N. (2021). “My Mom took My Phone and Locked It in the Wardrobe”: Parental Mediation in Teen-Parent Relationship in Technology Usage from Teens Perspective in Bangladesh. Available at SSRN 4000430. [link](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4000430)

Evidence: `nova-ahmed-personal-site/research-teen-and-youth.md`, heading **About Teen and Young Population**, **Publications**.

**Shondhi: Connecting Parents and Teachers of Children with Autism in
Bangladesh** — candidate: `year: 2021`; `status: preprint`; `type: preprint`;
`venueLabel: SSRN`; authors `["Saha, A.", "Sinha, A.", "Abeer, I. A.",
"Khan, S. S.", "Ahmed, N."]`; the source-stated `pdf.link` is the long SSRN
delivery URL in the source, and DOI is unknown.

> Saha, A., Sinha, A., Abeer, I. A., Khan, S. S., & Ahmed, N. (2021). Shondhi: Connecting Parents and Teachers of Children with Autism in Bangladesh. Available at SSRN 4005348. [pdf](https://deliverypdf.ssrn.com/delivery.php?ID=771116074111077001004077109108081025101007035037088048102101097022004007102095105103042029024024049112097070124110111073114091061081024064042101088102122009016028125085038045121108116005126088094124103013022113117124119103009020090114089075003114090007&EXT=pdf&INDEX=TRUE)

Evidence: `nova-ahmed-personal-site/research-autism.md`, heading **Shondhi**, **Publications**.

**Development and Testing of a Low-Cost Water Level Sensor and a Mobile Based
Real-time Flood Warning System for the Flash Flood Prone North Eastern Part of
Bangladesh** — candidate: `year: 2021`; `type: journal`; `venueLabel:
International Journal of Sensors Wireless Communications and Control`;
`volume: 11`; `issue: 4`; `pageStart: 413`; `pageEnd: 427`; authors retain the
source's ellipsis: `["Ahmed, N.", "Islam, M. S.", "Kalam, S.", "Islam, F.",
"Chowdhury, N.", "Hafiz, R. S.", "...", "Ahmed, S."]`; source-stated
`externalUrl: https://www.ingentaconnect.com/content/ben/swcc/2021/00000011/00000004/art00007`;
DOI unknown.

> Ahmed, N., Islam, M. S., Kalam, S., Islam, F., Chowdhury, N., Hafiz, R. S., ... & Ahmed, S. (2021). Development and Testing of a Low-Cost Water Level Sensor and a Mobile Based Real-time Flood Warning System for the Flash Flood Prone North Eastern Part of Bangladesh. International Journal of Sensors Wireless Communications and Control, 11(4), 413-427. [abstract](https://www.ingentaconnect.com/content/ben/swcc/2021/00000011/00000004/art00007)

Evidence: `nova-ahmed-personal-site/research-project-shonabondhu.md`, heading **Shonabondhu**, **Selected Publications**.

**A Minimal and Faster System to Identify Depression Through Smartphone: An
Explainable Machine Learning-Based Approach** — candidate: `status:
accepted-in-press` (source says _In Press_); `type: journal`; `venueLabel:
JMIR Formative Research`; authors `["Md. Sabbir Ahmed", "Nova Ahmed"]`;
source-stated preprint `pdf.link: https://psyarxiv.com/wk8bv/`; year and DOI
unknown.

> Md. Sabbir Ahmed and Nova Ahmed. A Minimal and Faster System to Identify Depression Through Smartphone: An Explainable Machine Learning-Based Approach. JMIR Formative Research [In Press]. [Preprint](https://psyarxiv.com/wk8bv/)

Evidence: `nova-ahmed-personal-site/research-mental-health-with-mon-majhi.md`, heading **Mental Health with Mon Majhi**, **Publications**, item 1.

**A Rule Mining and Bayesian Network Analysis to Explore the Link Between
Depression and Digital Behavioral Markers of Games App Usage** — candidate:
`year: 2022`; `status: accepted-in-press` (source says _In Press_); `type:
conference`; `venueLabel: 16th EAI International Conference on Pervasive
Computing Technologies for Healthcare (PervasiveHealth’22)`; authors `["Md.
Sabbir Ahmed", "Tanvir Hasan", "Md. Mahfuzur Rahman", "Nova Ahmed"]`;
source-stated `pdf.link: https://doi.org/10.31234/osf.io/d93zu`; that identifier
is explicitly a **Preprint** link and must not be put in `doi` without review.

> Md. Sabbir Ahmed, Tanvir Hasan, Md. Mahfuzur Rahman, and Nova Ahmed. 2022. A Rule Mining and Bayesian Network Analysis to Explore the Link Between Depression and Digital Behavioral Markers of Games App Usage. In Proceedings of 16th EAI International Conference on Pervasive Computing Technologies for Healthcare (PervasiveHealth’22) [In Press]. [Preprint](https://doi.org/10.31234/osf.io/d93zu).

Evidence: same file, heading **Mental Health with Mon Majhi**, **Publications**, item 3.

**Opportunities for Women in Computing in Bangladesh** — candidate: `year:
2022`; `type: conference`; `venueLabel: ICTD`; authors are source-elided as
`["Ahmed, N.", "et al."]`; source-stated PDF URL
`https://drive.google.com/file/d/1-x4EUMU4CKxjQ0-NZTs-VxcC4pB1wJAY/view?usp=sharing`; DOI,
pages, and publication status unknown.

> Ahmed, N.et al. (2022). Opportunities for Women in Computing in Bangladesh. ICTD. [pdf](https://drive.google.com/file/d/1-x4EUMU4CKxjQ0-NZTs-VxcC4pB1wJAY/view?usp=sharing)

Evidence: `nova-ahmed-personal-site/research-women-in-lab.md`, heading **Women in STEM, Computing**, **Peer Reviewed Publications**.

**Gender Disparity in Computer Science Education in Bangladesh: A Study of
Women’s Participation in Computer Science** — candidate: `year: 2019`; `type:
conference`; `venueLabel: 2019 IEEE International Conference on Engineering,
Technology and Education (TALE)`; `pageStart: 1`; `pageEnd: 7`; `publisher:
IEEE`; authors `["Tasmin, M.", "Ahmed, N.", "Motahar, T."]`; DOI/URL unknown.

> Tasmin, M., Ahmed, N., & Motahar, T. (2019, December). Gender Disparity in Computer Science Education in Bangladesh: A Study of Women’s Participation in Computer Science. In 2019 IEEE International Conference on Engineering, Technology and Education (TALE) (pp. 1-7). IEEE.

Evidence: same file, heading **Women in STEM, Computing**, **Peer Reviewed Publications**.

**Collaborative Group Learning in Programming Classes** — candidate: `year:
2019`; `type: conference`; `venueLabel: 2019 IEEE International Conference on
Engineering, Technology and Education (TALE)`; `pageStart: 1`; `pageEnd: 4`;
`publisher: IEEE`; authors `["Shahria, M. T.", "Ahmed, N."]`; source-stated
`pdf.link: https://drive.google.com/file/d/1yOG5B8ysYwKulfDqgDFx_b8H8rfglb_H/view?usp=sharing`; DOI unknown.

> Shahria, M. T., & Ahmed, N. (2019, December). Collaborative Group Learning in Programming Classes. In 2019 IEEE International Conference on Engineering, Technology and Education (TALE) (pp. 1-4). IEEE. [pdf](https://drive.google.com/file/d/1yOG5B8ysYwKulfDqgDFx_b8H8rfglb_H/view?usp=sharing)

Evidence: same file, heading **Women in STEM, Computing**, **Peer Reviewed Publications**.

## Duplicates, variants, and conflicts requiring review

| Candidate / source evidence                                                                                                                 | Issue                                                                                                                   | Safe handling                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| AI4Bangladesh, primary catalogue **2025** line 98 and **2024** line 115                                                                     | Exact same citation and DOI but listed under two year headings; citation itself says 2025 and ICTD '24.                 | One candidate keyed by DOI; retain both source locations in provenance; verify publication year before finalizing. |
| Nobody Can See Us, primary catalogue **2024** lines 125 and 141                                                                             | Same title/author pair/venue/pages appears twice in stylistic variants.                                                 | One candidate after title+authors+year review; keep both citations.                                                |
| Developing/A Personalized Communication Application for Children with Autism, primary **2024** lines 119 and 139                            | Similar title but different title wording, authorship, and venue (CSCW Companion vs COMPASS).                           | Do **not** merge automatically.                                                                                    |
| Understanding the Educational Landscape of Children with Autism, primary **2020** line 224; personal **Shondhi**                            | The personal page has two conflicting author lists/title forms for what may be the same iConference work.               | Keep separate candidates or resolve against a publisher record; no safe automatic merge.                           |
| Strategic communication to counter sexual harassment, primary **2018** line 304; personal **Protibadi**                                     | Catalogue calls it 2018 and gives page 1119; personal page calls it 2020 and gives pages 1119–1129.                     | Conflict on year/pages; retain both citations and review.                                                          |
| iFreephony, primary **2020** line 226 and **2017** line 351                                                                                 | Same title/venue/volume/pages but two year headings.                                                                    | One possible duplicate, not an automatic merge; review year.                                                       |
| Smartphone/Instagram publications, primary **2020** lines 238 and personal **Teen and Young Population** / **Mental Health with Mon Majhi** | Personal site supplies complete authors, pages, and DOI for the Instagram paper; the catalogue abbreviation has no DOI. | Preserve the personal site's `10.1109/TENSYMP50017.2020.9230945` as stated evidence after title+author review.     |
| 2014 Telemedicine citation, primary **2014** line 442                                                                                       | The source prints year `2104`.                                                                                          | Preserve citation text and use a review item; do not silently correct `year`.                                      |
| `M. H., Mahmood` (primary **2020** line 232), `Anuva C.` / `Arisha C.` (line 234), and every `et al.`/ellipsis                              | Incomplete/ambiguous names cannot be linked safely to Team Members.                                                     | Create Custom Authors exactly as source text and a Review Item.                                                    |

## Candidate Venues

These are lookup candidates only. No URL, ISSN, OpenAlex ID, or Wikidata ID is
invented. `alternateNames` may retain source variants after a human resolves
them. Evidence is the primary catalogue's named year headings unless stated.

| Venue candidate (`name` / observed variants)                                                                           | Candidate `type`                                                       | Candidate publisher Organization                                    | Evidence groups                                                                         |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ACM Journal on Computing and Sustainable Societies / ACM J. Comput. Sustain. Soc.                                      | journal                                                                | Association for Computing Machinery                                 | `publications.md`, **2025**, **2024**                                                   |
| ACM Transactions on Computer-Human Interaction                                                                         | journal                                                                | Association for Computing Machinery                                 | same, **2025**                                                                          |
| Interactive Journal of Medical Research / JMIR                                                                         | journal, unresolved naming conflict                                    | unknown                                                             | same, **2025**                                                                          |
| ICTD / Proceedings of the 13th International Conference on Information & Communication Technologies and Development    | conference                                                             | Association for Computing Machinery (stated for AI4Bangladesh only) | same, **2025**, **2024**, **2015**, **2017**                                            |
| COMPASS / ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies                                          | conference                                                             | Association for Computing Machinery                                 | same, **2025**, **2024**, **2022**                                                      |
| CHI Conference on Human Factors in Computing Systems / Extended Abstracts / CHI Conference Extended Abstracts          | conference / extended-abstract variants                                | Association for Computing Machinery where citation states ACM       | same, **2025**, **2024**, **2022–2016**                                                 |
| CSCW / Companion Publication of the Conference on Computer-Supported Cooperative Work and Social Computing             | conference / extended-abstract                                         | unknown                                                             | same, **2024**                                                                          |
| JMIR Research Protocols; JMIR Rehabilitation and Assistive Technologies; JMIR Formative Research                       | journal                                                                | unknown                                                             | catalogue **2024**; personal **Mental Health with Mon Majhi**                           |
| PervasiveHealth / EAI International Conference on Pervasive Computing Technologies for Healthcare                      | conference                                                             | EAI (candidate only)                                                | catalogue **2022**; personal **Mental Health with Mon Majhi**                           |
| IEEE TALE / International Conference on Teaching, Assessment, and Learning for Engineering                             | conference                                                             | IEEE                                                                | catalogue **2022**, **2020**; personal **Women in STEM, Computing**                     |
| IEEE TENSYMP / IEEE Region 10 Symposium                                                                                | conference                                                             | IEEE                                                                | catalogue **2020**; personal **Mental Health with Mon Majhi**                           |
| UbiComp/ISWC and ACM International Joint Conference on Pervasive and Ubiquitous Computing and ISWC proceedings/adjunct | conference / extended-abstract variants                                | Association for Computing Machinery where stated                    | catalogue **2020**, **2019**, **2018**, **2016**                                        |
| International Conference on Information / iConference 2020 / Sustainable Digital Communities                           | conference                                                             | Springer / Springer Nature (source variants)                        | catalogue **2020**; personal **Shondhi**                                                |
| SOUPS / Fourteenth Symposium on Usable Privacy and Security                                                            | conference                                                             | unknown                                                             | catalogue **2018**; personal **Next Biliion Users**                                     |
| XRDS: Crossroads, The ACM Magazine for Students                                                                        | journal                                                                | Association for Computing Machinery                                 | catalogue **2019**; personal **Protibadi**                                              |
| Interactions                                                                                                           | journal                                                                | unknown (the captured citations do not name a publisher)            | catalogue **2020**, **2017**; personal **Tech for RMG workers**, **Next Biliion Users** |
| Computers & Electrical Engineering                                                                                     | journal                                                                | unknown                                                             | catalogue **2017**; personal **Shonabondhu**                                            |
| International Journal of Sensors Wireless Communications and Control                                                   | journal                                                                | unknown                                                             | personal **Shonabondhu**                                                                |
| Autism                                                                                                                 | journal                                                                | unknown                                                             | catalogue **2019**; personal **Shondhi**                                                |
| Technology in Society; SN Social Sciences; American Behavioral Scientist                                               | journal                                                                | unknown                                                             | catalogue **2022**; personal **Protibadi**, **Women in STEM, Computing**                |
| Frontiers in Communication: Disaster Communications; Journal of Bangladesh Studies; Journal of Biomedical Analytics    | journal                                                                | unknown                                                             | catalogue **2022**, **2020**                                                            |
| SSRN; arXiv                                                                                                            | preprint repository / not a Venue relationship without policy decision | unknown                                                             | personal **Teen and Young Population**, **Shondhi**; catalogue **2018**, **2014**       |

The many remaining named containers in the primary catalogue (for example ICIEV,
ICCIT, COMSNETS, RO-MAN, R10-HTC, ICDCS, COMPSAC, WEDC, Grace Hopper, and book
titles) are also Venue candidates when cited. They must retain the exact source
string as `venueLabel`; their canonical Venue identity, `shortName`, and type
remain unknown until a human resolves them. Evidence: `publications.md`, each
corresponding year heading **2012–2019**.

## Candidate Organizations

| Candidate `name`                                                                    | Candidate `type` | Source-stated role / limitations                                                                                                                                  | Evidence                                                                          |
| ----------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Association for Computing Machinery                                                 | publisher        | Explicitly named publisher for AI4Bangladesh and Jalli; `ACM` elsewhere is an observed abbreviation, not a new Organization.                                      | `publications.md`, **2025** lines 98 and 108                                      |
| IEEE                                                                                | publisher        | Explicitly named in many citation strings; do not infer a publisher relationship where the citation does not say it.                                              | primary catalogue, year groups **2012–2024**; personal pages above                |
| Springer / Springer International Publishing / Springer Nature / Springer Singapore | publisher        | Observed variants; one Organization candidate with `alternateNames` only after review.                                                                            | primary **2022**, **2020**, **2018**, **2015**; personal **Shondhi**              |
| Edward Elgar Publishing                                                             | publisher        | Explicitly named in the 2022 handbook citation.                                                                                                                   | `publications.md`, **2022**, line 178                                             |
| IGI Global                                                                          | publisher        | Explicitly named in 2012 book/book-chapter citations.                                                                                                             | same, **2012**, lines 460–474                                                     |
| Trans Tech Publications Ltd.                                                        | publisher        | Explicitly named in 2013 citation.                                                                                                                                | same, **2013**, line 453                                                          |
| North South University                                                              | university       | Named as the funder of a BDT 499,500 grant in the mental-health page and as seed funder in Bap re Bap; it is not an author affiliation in a Publication citation. | personal **Mental Health with Mon Majhi**, **Fund**; **Bap re Bap**, project text |
| United International University                                                     | university       | Named alongside North South University as grant awarder; not a cited Publication author affiliation.                                                              | personal **Mental Health with Mon Majhi**, **Fund**                               |

No ROR, OpenAlex, country, URL, or organization-to-author affiliation is
source-stated for these candidates. Do not populate those fields from memory or
external lookup in this evidence pass.

## Media evidence relevant to Publications

Publication PDF/preprint links are recorded only in the additional candidates
above or in the cited primary-catalogue links. The two site captures contain
many project photographs, but none is stated to be a Publication cover/image;
do not attach a project photo as Publication media. The source’s Google Sites
image URLs are retained verbatim in the raw captures and belong to the related
project-page evidence, not to the Publication record.

## Capture notes

This file is derived from the 2026-09-12 capture. Compared with the earlier
capture it replaced, the catalogue and the personal-site research pages have
the same citations, year headings, author order, DOI strings, and linked
publication URLs; only site navigation/footer markup and Google image-delivery
URLs changed, and the catalogue is shifted down by 63 lines of navigation.
Line numbers above refer to the fresh files.

## Import gate

Before creating a record, resolve duplicates/variants, expand truncated author
lists from an authoritative bibliographic source, and safe-match Team Members
only by an exact external identifier or exact full name. Preserve all listed
source locations as provenance notes. This staging file deliberately leaves
uncertain fields empty rather than turning plausible guesses into public data.
