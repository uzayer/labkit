import type { Venue } from './types'

/**
 * Recurring venues in DIAL's publication record, generated 2026-09-20 alongside
 * publications.ts. Only venues with a recognizable name that recur (or are
 * flagship HCI venues) get a record; everything else stays as a free-text
 * `venueLabel` on the publication. No ISSN/OpenAlex IDs are asserted here.
 */

export const venues: Venue[] = [
  {
    id: 'chi',
    name: 'ACM CHI Conference on Human Factors in Computing Systems',
    shortName: 'CHI',
    type: 'conference',
    url: 'https://chi.acm.org/',
  }, // 22 publication(s)
  {
    id: 'cscw',
    name: 'ACM Conference on Computer-Supported Cooperative Work and Social Computing',
    shortName: 'CSCW',
    type: 'conference',
    url: 'https://cscw.acm.org/',
  }, // 3 publication(s)
  {
    id: 'acm-jcss',
    name: 'ACM Journal on Computing and Sustainable Societies',
    shortName: 'ACM JCSS',
    type: 'journal',
    url: 'https://dl.acm.org/journal/jcss',
  }, // 7 publication(s)
  {
    id: 'compass',
    name: 'ACM SIGCAS/SIGCHI Conference on Computing and Sustainable Societies',
    shortName: 'COMPASS',
    type: 'conference',
    url: 'https://compass.acm.org/',
  }, // 8 publication(s)
  {
    id: 'ictd',
    name: 'International Conference on Information and Communication Technologies and Development',
    shortName: 'ICTD',
    type: 'conference',
  }, // 8 publication(s)
  {
    id: 'tochi',
    name: 'ACM Transactions on Computer-Human Interaction',
    shortName: 'TOCHI',
    type: 'journal',
    url: 'https://dl.acm.org/journal/tochi',
  }, // 1 publication(s)
  {
    id: 'pacm-hci',
    name: 'Proceedings of the ACM on Human-Computer Interaction',
    shortName: 'PACM HCI',
    type: 'journal',
    url: 'https://dl.acm.org/journal/pacmhci',
  }, // 1 publication(s)
  {
    id: 'ubicomp',
    name: 'ACM International Joint Conference on Pervasive and Ubiquitous Computing (UbiComp/ISWC)',
    shortName: 'UbiComp',
    type: 'conference',
  }, // 9 publication(s)
  {
    id: 'mobilehci',
    name: 'International Conference on Human-Computer Interaction with Mobile Devices and Services',
    shortName: 'MobileHCI',
    type: 'conference',
  }, // 2 publication(s)
  { id: 'asian-chi', name: 'Asian CHI Symposium', shortName: 'Asian CHI', type: 'conference' }, // 6 publication(s)
  {
    id: 'hcixb',
    name: 'HCI Across Borders Symposium (at CHI)',
    shortName: 'HCIxB',
    type: 'workshop',
  }, // 8 publication(s)
  {
    id: 'comsnets',
    name: 'International Conference on COMmunication Systems & NETworkS',
    shortName: 'COMSNETS',
    type: 'conference',
  }, // 6 publication(s)
  {
    id: 'iciev',
    name: 'International Conference on Informatics, Electronics & Vision',
    shortName: 'ICIEV',
    type: 'conference',
  }, // 6 publication(s)
  {
    id: 'iccit',
    name: 'International Conference on Computer and Information Technology',
    shortName: 'ICCIT',
    type: 'conference',
  }, // 4 publication(s)
  {
    id: 'icece',
    name: 'International Conference on Electrical and Computer Engineering',
    shortName: 'ICECE',
    type: 'conference',
  }, // 2 publication(s)
  {
    id: 'ieee-tale',
    name: 'IEEE International Conference on Teaching, Assessment, and Learning for Engineering',
    shortName: 'IEEE TALE',
    type: 'conference',
  }, // 3 publication(s)
  {
    id: 'pervasivehealth',
    name: 'EAI International Conference on Pervasive Computing Technologies for Healthcare',
    shortName: 'PervasiveHealth',
    type: 'conference',
  }, // 3 publication(s)
  {
    id: 'interactions',
    name: 'ACM Interactions',
    shortName: 'Interactions',
    type: 'journal',
    url: 'https://interactions.acm.org/',
  }, // 2 publication(s)
  {
    id: 'jmir-res-protoc',
    name: 'JMIR Research Protocols',
    shortName: 'JMIR Res Protoc',
    type: 'journal',
    url: 'https://www.researchprotocols.org/',
  }, // 2 publication(s)
  {
    id: 'jmir-form-res',
    name: 'JMIR Formative Research',
    shortName: 'JMIR Form Res',
    type: 'journal',
    url: 'https://formative.jmir.org/',
  }, // 3 publication(s)
]
