import type { DataFromCollectionSlug } from 'payload'

// Document types come from the host app's generated payload-types.ts, through
// Payload's `GeneratedTypes` module augmentation. Core never generates types itself.
export type Award = DataFromCollectionSlug<'awards'>
export type Grant = DataFromCollectionSlug<'grants'>
export type ImportRun = DataFromCollectionSlug<'import-runs'>
export type Organization = DataFromCollectionSlug<'organizations'>
export type Project = DataFromCollectionSlug<'projects'>
export type Publication = DataFromCollectionSlug<'publications'>
export type ResearchTheme = DataFromCollectionSlug<'research-themes'>
export type Team = DataFromCollectionSlug<'team'>
export type User = DataFromCollectionSlug<'users'>
export type Venue = DataFromCollectionSlug<'venues'>
