import type { CustomBlock as CustomBlockProps, Team } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { TeamDialClient } from './team-dial-client'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const TeamDial: React.FC<
  CustomBlockProps & {
    id?: string
    publicContext: PublicContextProps
    disableContainer?: boolean
  }
> = async (props) => {
  const { id, teamDial, publicContext, disableContainer } = props

  if (!teamDial) {
    return null
  }

  const { heading, description, rolesToDisplay } = teamDial

  let teamMembers: Team[] = []

  if (rolesToDisplay && rolesToDisplay.length > 0) {
    const payload = await getPayload({ config: configPromise })

    const fetchedTeam = await payload.find({
      collection: 'team',
      depth: 1,
      limit: 100,
      where: {
        and: [
          {
            displayInWebsite: {
              equals: true,
            },
          },
          {
            role: {
              in: rolesToDisplay,
            },
          },
        ],
      },
    })

    teamMembers = fetchedTeam.docs
  }

  return (
    <div id={`block-${id}`}>
      <TeamDialClient
        teamMembers={teamMembers}
        rolesToDisplay={rolesToDisplay || []}
        heading={heading || null}
        description={description || null}
        disableContainer={disableContainer}
        publicContext={publicContext}
      />
    </div>
  )
}

export default TeamDial
