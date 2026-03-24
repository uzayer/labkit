import type { CollectionBeforeChangeHook } from 'payload'
import type { Team } from '../../../payload-types'

export const setDisplayInTeam: CollectionBeforeChangeHook<Team> = ({ data }) => data
