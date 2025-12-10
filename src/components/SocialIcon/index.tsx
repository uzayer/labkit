import {
  FaAndroid,
  FaApple,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGooglePlay,
  FaInstagram,
  FaLinkedin,
  FaRedditAlien,
  FaTelegramPlane,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'

import { SocialIconType } from './config'

const iconMap = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  discord: FaDiscord,
  reddit: FaRedditAlien,
  telegram: FaTelegramPlane,
  github: FaGithub,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  apple: FaApple,
  android: FaAndroid,
  googleplay: FaGooglePlay,
}

export interface SocialIconProps {
  type: SocialIconType
  className?: string
}

/**
 * Use this component to display social media icons coming from react-icons
 * @param param0
 * @returns
 */
export const SocialIcon: React.FC<SocialIconProps> = ({ type, className = 'size-6' }) => {
  const Icon = iconMap[type]
  if (!Icon) return null

  return <Icon className={className} />
}
