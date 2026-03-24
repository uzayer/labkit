import * as React from 'react'
import DesignVersionPreviewClient from './index.client'
import { UIFieldServerProps } from 'payload'
import { DesignVersionPreviewOptions } from './config'

// The props that are passed to this component from Payload
type DesignVersionPreviewProps = UIFieldServerProps & {
  options: DesignVersionPreviewOptions
}

/**
 * The server component for the DesignVersionPreview component. No react
 * hooks available here.
 * @param param0
 * @returns
 */
const DesignVersionPreview: React.FC<DesignVersionPreviewProps> = ({ options, path }) => {
  // Extract the necessary props from the Payload props

  return <DesignVersionPreviewClient path={path} options={options} />
}

export default DesignVersionPreview
