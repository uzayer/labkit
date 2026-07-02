# Events (`/events`)

Media-heavy feed of lab activity. No blog posts, no long-form. Block TBD — needs photo support per entry, unlike `changelog1`.

---

## Content scope — what qualifies

- Conference presentations (paper presented at CHI, CSCW, COMPASS, ICTD, etc.)
- Conference trips (students attending conferences, summer schools, winter schools — even without a paper)
- Organised events (SIGCHI Summer Schools, DIAL HCI Research Symposium, workshops DIAL hosted or co-organised)
- Invited talks / keynotes (Nova or lab members speaking at external venues)
- Awards — the announcement moment; full record lives on `/awards`
- Community engagement (BanglaCHI organising, SIGCHI Dhaka chapter, Flood Relief 2024, July Movement support — needs 2–3 sentence description + photo to carry context for international visitors)
- Media appearances (if/when they happen)

## What does not go here

- Recruitment announcements → `/join-us`
- Publications → `/publications`

## Entry format (varies by type)

- Conference presentation / trip / invited talk: 1 sentence, external link optional, photo optional
- Organised event / community engagement: 2–3 sentences, photo encouraged — context matters for these

---

## 1. Feed

- Typed entries: conference presentation | conference trip | organised event | invited talk | award | community engagement | media appearance
- Each entry: type badge, title, date, description (length varies by type — see above), photo (Media, optional), external link (optional)
- Filterable by type
- Newest first
- Data source: Events collection (new, lightweight — separate from Posts)
  - Fields: type (select), title, date, description (richText, short), photo (Media, optional), url (optional)
