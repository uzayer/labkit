# DIAL identity and factual baseline

This file separates confirmed identity from working claims. It is the first place to check before writing shared copy, metadata, navigation labels, or structured data.

## Confirmed

- **Name:** Design Inclusion and Access Lab
- **Short name:** DIAL
- **Institution:** North South University
- **Location:** Dhaka, Bangladesh
- **PI:** Dr. Nova Ahmed

Use the full name without commas and do not expand DIAL as “Design & Inclusion Lab,” “Design, Inclusion and Access Lab,” or “Diverse & Inclusive Accessible Lab.”

Preferred first mention:

> DIAL—the Design Inclusion and Access Lab at North South University—…

Subsequent mentions may use “DIAL” or “the Lab.”

## Working values requiring confirmation

The prototype and captured sources currently suggest the following, but they are not approved facts merely because they appear in code or Markdown:

- founding year and the relationship between NSU HCI and DIAL;
- canonical Publication, Project, Award, Team Member, and alumni counts;
- official room/address and public contact email;
- current recruitment window and openings;
- which Team Members are active, alumni, or public;
- which Organizations count as current collaborators;
- which Projects are active, completed, or only names awaiting research;
- the exact nine-theme taxonomy and its public ordering;
- Award names, years, recipients, and whether they are Lab-wide or personal;
- social profiles DIAL wants to publish.

Until confirmed, these values may be used as realistic prototype material but must not be described as verified.

## Factual-source policy

- `scraped-data/` preserves what the current Lab site, the PI's personal site, and the DIAL proposal said when captured.
- `organized-from-scrapes/` and `dial-test/src/data/` are normalized interpretations of those sources. Normalization can introduce mistakes.
- Crossref, OpenAlex, ORCID, and DBLP can support bibliographic facts but do not decide Lab membership, Project ownership, Research Themes, or editorial prominence.
- Payload becomes the operational source of truth only after the Operator has reviewed the imported records.
- Direct confirmation from DIAL overrides scraped and inferred material. Record consequential corrections in `LOG.md`.

## Copy guardrails

- Prefer specific work, communities, Publications, Awards, and outcomes over unsupported superlatives.
- Do not turn a Project stub or fabricated prototype Publication into public fact.
- Distinguish the Lab's record from Dr. Nova Ahmed's career-wide personal record.
- Do not infer active membership from co-authorship.
- Use “Team Member” for records in LabKit's publication graph; website visibility is a separate decision.
