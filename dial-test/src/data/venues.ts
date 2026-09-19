import type { Venue } from './types'

/**
 * Fixture venues: a small, hand-picked subset chosen to cover edge cases
 * (see ./index.ts). Edit freely — this is test data, not DIAL's record.
 * The full scraped set is archived in labs/dial/dial-test-full-data/.
 */
export const venues: Venue[] = [
  {
    id: "chi",
    name: "ACM CHI Conference on Human Factors in Computing Systems",
    shortName: "CHI",
    type: "conference",
    url: "https://chi.acm.org/"
  },
  {
    id: "acm-jcss",
    name: "ACM Journal on Computing and Sustainable Societies",
    shortName: "ACM JCSS",
    type: "journal",
    url: "https://dl.acm.org/journal/jcss"
  },
  {
    id: "ictd",
    name: "International Conference on Information and Communication Technologies and Development",
    shortName: "ICTD",
    type: "conference"
  },
  {
    id: "tochi",
    name: "ACM Transactions on Computer-Human Interaction",
    shortName: "TOCHI",
    type: "journal",
    url: "https://dl.acm.org/journal/tochi"
  },
  {
    id: "hcixb",
    name: "HCI Across Borders Symposium (at CHI)",
    shortName: "HCIxB",
    type: "workshop"
  },
  {
    id: "comsnets",
    name: "International Conference on COMmunication Systems & NETworkS",
    shortName: "COMSNETS",
    type: "conference"
  },
  {
    id: "pervasivehealth",
    name: "EAI International Conference on Pervasive Computing Technologies for Healthcare",
    shortName: "PervasiveHealth",
    type: "conference"
  },
  {
    id: "jmir-res-protoc",
    name: "JMIR Research Protocols",
    shortName: "JMIR Res Protoc",
    type: "journal",
    url: "https://www.researchprotocols.org/"
  },
  {
    id: "jmir-form-res",
    name: "JMIR Formative Research",
    shortName: "JMIR Form Res",
    type: "journal",
    url: "https://formative.jmir.org/"
  }
]
