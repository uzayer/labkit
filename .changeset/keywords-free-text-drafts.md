---
'labkit': minor
---

Simplify RIMS collections for lab-scale entry friction: replace the Keywords lookup collection with free-text `hasMany` fields on Publications (`keywords`) and Team (`researchInterests`), and remove drafts/versioning from the fact-record collections (Publications, Team, Awards, Grants, ResearchThemes) — their read access is now public (`anyone`). Projects keeps drafts since project writeups are editorial content with live preview.
