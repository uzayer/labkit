/** Run against a throwaway SQLite database to check auth and admin editing. */
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../../src/payload.config'

const payload = await getPayload({ config })
const admin = await payload.find({
  collection: 'roles',
  where: { slug: { equals: 'admin' } },
  limit: 1,
  overrideAccess: true,
})
if (!admin.docs[0]) throw new Error('Default Admin role is missing')

const email = `sqlite-check-${randomUUID()}@example.invalid`
const password = randomUUID() + randomUUID()
const user = await payload.create({
  collection: 'users',
  data: { email, password, name: 'SQLite check', roles: [admin.docs[0].id] },
  overrideAccess: true,
})

try {
  const login = await payload.login({ collection: 'users', data: { email, password } })
  if (login.user?.id !== user.id) throw new Error('Login returned the wrong user')
  const edited = await payload.update({
    collection: 'users',
    id: user.id,
    data: { name: 'SQLite check edited' },
    user: login.user,
    overrideAccess: false,
  })
  if (edited.name !== 'SQLite check edited') throw new Error('Admin edit did not persist')
  console.log('PASS: Admin user creation, password login, authorized edit')
} finally {
  // This is an isolated smoke database; direct cleanup also works when this
  // temporary account is the only Admin and the normal last-Admin guard fires.
  await payload.db.deleteOne({ collection: 'users', where: { id: { equals: user.id } } })
}
