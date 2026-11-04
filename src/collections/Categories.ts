import { isAdminHidden, anyone, hasPermission } from '@labkit/core/access'
import type { CollectionConfig } from 'payload'

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
  versions: false,
  authorship: false,
}

export default Categories
