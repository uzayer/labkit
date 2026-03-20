# Security Quick Wins

**Priority:** High — before any public deployment
**Area:** DevOps, Admin

## Context

Full audit in `docs/security-issues.md`. These are the fixes that are fast and high-impact.

## Immediate

- [ ] Change backup blob storage to `access: 'private'` (finding #1)
- [ ] Add URL allowlist to backup restore endpoint (finding #2)
- [ ] Replace `image/*` with explicit MIME types in Media collection (finding #8)
- [ ] Add `robots.txt` blocking `/admin`, `/api`, `/next` (finding #22)
- [ ] Separate admin auto-provisioning from email domain allowlist (finding #3)

## Short-term

- [ ] Add security headers in `next.config.ts` or middleware (finding #9)
- [ ] Add admin auth checks in backup/changelog server actions (findings #10, #11)
- [ ] Disable GraphQL Playground in production (finding #7)
- [ ] Configure `maxLoginAttempts` and `lockoutTime` on Users (finding #19)
- [ ] Fix OAuth2 open redirect — reject `//` paths (finding #16)
