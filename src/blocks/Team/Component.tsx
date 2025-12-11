import { TeamDesignVersion } from './config'
import Team5 from '@/blocks/Team/team5'
import Team5_9 from '@/blocks/Team/team5-9'
import Team9 from '@/blocks/Team/team9'

type TeamVersionValue = TeamDesignVersion

type Team<T extends string = string> = Required<Record<TeamVersionValue, React.FC<any>>> &
  Record<T, React.FC<any>>

const team: Team = {
  TEAM5: Team5,
  'TEAM5-9': Team5_9,
  TEAM9: Team9,
}

export const TeamBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'team') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const TeamToRender = team[designVersion as TeamVersionValue]

  if (!TeamToRender) return null

  return <TeamToRender {...props} />
}

export default TeamBlock
