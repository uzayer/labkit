import type { CollectionBeforeChangeHook } from 'payload'
import type { Team } from '../../../types'

export const setDisplayInTeam: CollectionBeforeChangeHook<Team> = ({ data }) => data
