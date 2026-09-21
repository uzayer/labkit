import { isAdminHidden } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { hasPermission } from '@/utilities/checkPermission'

const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: anyone,
    update: hasPermission('canManageContent'),
  },
  admin: {
    hidden: isAdminHidden,
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}

export default Categories
