'use client'
import {
  Banner,
  Button,
  CheckboxInput,
  Gutter,
  SetStepNav,
  TextareaInput,
  TextInput,
  toast,
} from '@payloadcms/ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import type { FeatureName, LabFeatures } from '../globals/Features/features'
import type { StagedCandidate } from '../ingestion/staging'
import { SETUP_LATER_COOKIE } from './cookie'
import './index.scss'

interface RunState {
  id: string
  status: 'staged' | 'running' | 'completed' | 'failed' | 'cancelled' | null | undefined
  orcidId: string | null
  candidates: StagedCandidate[]
  progress: {
    total?: number | null
    processed?: number | null
    created?: number | null
    skippedExisting?: number | null
    failed?: number | null
  } | null
  error: string | null
  openReviewItems?: number
}

interface LabInfoForm {
  name: string
  shortName: string
  headline: string
  description: string
  email: string
  institution: string
  department: string
  city: string
  country: string
  logo: { id: string; url: string | null; filename: string | null } | null
}

export interface WizardInitialState {
  adminRoute: string
  apiRoute: string
  pi: { id: string; name: string; orcid: string } | null
  labInfo: LabInfoForm
  features: LabFeatures
  run: RunState | null
  step: number | null
}

interface Employment {
  organization: string
  department?: string
  roleTitle?: string
  city?: string
  country?: string
  startYear?: number
  endYear?: number
  current: boolean
}

interface OrcidLookup {
  orcid: string
  profile: {
    givenNames?: string
    familyName?: string
    creditName?: string
    country?: string
    employments: Employment[]
  } | null
  teamMember: { id: string; name: string | null } | null
}

const STEP_NAV = [{ label: 'Set up your Lab' }]

const STEPS = ['PI', 'Lab info', 'Features', 'First import', 'Done'] as const

const FEATURE_TEXT: Record<FeatureName, { label: string; help: string }> = {
  projects: {
    label: 'Projects',
    help: 'Named bodies of work, each with a page grouping its people and Publications.',
  },
  newsItems: {
    label: 'News Items',
    help: 'Dated announcements: a paper accepted, an event held. Shown on the home and News pages.',
  },
  researchThemes: {
    label: 'Research Themes',
    help: "The Lab's research areas, each with a page listing its Publications and Projects.",
  },
  grants: {
    label: 'Grants',
    help: 'Funding awards made to the Lab, entered by hand and listed on the site.',
  },
  awards: {
    label: 'Awards',
    help: 'Recognitions received by people or Publications, entered by hand.',
  },
}

class RequestError extends Error {}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    ...init,
    headers:
      init?.body instanceof FormData
        ? init.headers
        : { 'Content-Type': 'application/json', ...init?.headers },
  })
  const data = (await response.json().catch(() => ({}))) as {
    error?: string
    errors?: Array<{ message?: string }>
  }
  if (!response.ok) {
    throw new RequestError(
      data.error ?? data.errors?.[0]?.message ?? `Request failed (${response.status})`,
    )
  }
  return data as T
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const initialStep = (initial: WizardInitialState): number => {
  if (initial.step && initial.step >= 1 && initial.step <= STEPS.length) return initial.step
  if (!initial.pi) return 1
  if (!initial.labInfo.name) return 2
  if (!initial.run) return 3
  return 4
}

export function OnboardingWizard({ initial }: { initial: WizardInitialState | null }) {
  if (!initial) {
    return (
      <Gutter className="labkit-onboarding">
        <h1>Set up your Lab</h1>
        <Banner type="warning">Only an admin can run the setup wizard.</Banner>
      </Gutter>
    )
  }
  return <Wizard initial={initial} />
}

function Wizard({ initial }: { initial: WizardInitialState }) {
  const { adminRoute, apiRoute } = initial
  const api = useCallback((path: string) => `${apiRoute}${path}`, [apiRoute])
  const [step, setStepState] = useState(() => initialStep(initial))
  const [pi, setPi] = useState(initial.pi)
  const [labInfo, setLabInfo] = useState(initial.labInfo)
  const [features, setFeatures] = useState(initial.features)
  const [run, setRun] = useState<RunState | null>(initial.run)

  // The step lives in the URL so a reload lands where the editor was.
  const setStep = useCallback((next: number) => {
    setStepState(next)
    const url = new URL(window.location.href)
    url.searchParams.set('step', String(next))
    window.history.replaceState(null, '', url)
  }, [])

  return (
    <Gutter className="labkit-onboarding">
      <SetStepNav nav={STEP_NAV} />
      <div className="labkit-onboarding__header">
        <h1>Set up your Lab</h1>
        <a
          href={adminRoute}
          onClick={() => {
            document.cookie = `${SETUP_LATER_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
          }}
        >
          Set up later
        </a>
      </div>
      <ol className="labkit-onboarding__steps">
        {STEPS.map((label, index) => {
          const number = index + 1
          const reachable =
            number === 1 || (number === 2 && pi) || (number >= 3 && pi && labInfo.name)
          return (
            <li
              key={label}
              className={number === step ? 'is-current' : number < step ? 'is-done' : undefined}
            >
              <button type="button" disabled={!reachable} onClick={() => setStep(number)}>
                <span>{number}</span> {label}
              </button>
            </li>
          )
        })}
      </ol>

      {step === 1 && (
        <PiStep
          api={api}
          pi={pi}
          onDone={(nextPi, employment) => {
            setPi(nextPi)
            if (employment) {
              // Prefill only what the editor hasn't already typed.
              setLabInfo((current) => ({
                ...current,
                institution: current.institution || employment.organization,
                department: current.department || employment.department || '',
                city: current.city || employment.city || '',
                country: current.country || employment.country || '',
              }))
            }
            setStep(2)
          }}
        />
      )}
      {step === 2 && (
        <LabInfoStep
          api={api}
          labInfo={labInfo}
          onChange={setLabInfo}
          onBack={() => setStep(1)}
          onDone={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <FeaturesStep
          api={api}
          features={features}
          onChange={setFeatures}
          onBack={() => setStep(2)}
          onDone={() => setStep(4)}
        />
      )}
      {step === 4 && pi && (
        <ImportStep
          adminRoute={adminRoute}
          api={api}
          orcid={pi.orcid}
          run={run}
          onRun={setRun}
          onBack={() => setStep(3)}
          onDone={() => setStep(5)}
        />
      )}
      {step === 5 && <DoneStep adminRoute={adminRoute} api={api} run={run} />}
    </Gutter>
  )
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="labkit-onboarding__actions">{children}</div>
}

function PiStep({
  api,
  pi,
  onDone,
}: {
  api: (path: string) => string
  pi: WizardInitialState['pi']
  onDone: (pi: NonNullable<WizardInitialState['pi']>, employment: Employment | null) => void
}) {
  const [orcidInput, setOrcidInput] = useState(pi?.orcid ?? '')
  const [lookup, setLookup] = useState<OrcidLookup | null>(null)
  const [employmentIndex, setEmploymentIndex] = useState(0)
  const [person, setPerson] = useState({ firstName: '', lastName: '', title: '' })
  const [busy, setBusy] = useState(false)

  const employments = lookup?.profile?.employments ?? []
  const employment = employments[employmentIndex] ?? null

  const find = async () => {
    setBusy(true)
    try {
      const result = await request<OrcidLookup>(
        api(`/labkit/onboarding/orcid?id=${encodeURIComponent(orcidInput)}`),
      )
      setLookup(result)
      setEmploymentIndex(0)
      setPerson({
        firstName: result.profile?.givenNames ?? '',
        lastName: result.profile?.familyName ?? '',
        title: result.profile?.employments[0]?.roleTitle ?? '',
      })
      if (!result.profile) {
        toast.warning("Couldn't read that ORCID record. You can still type the PI's details.")
      }
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    if (!lookup) return
    setBusy(true)
    try {
      if (lookup.teamMember) {
        // Already a Team Member with this exact ORCID iD: link them, and make them
        // the Director, which is what makes them the PI on the site. Nothing else
        // on their record changes.
        await request(api(`/team/${lookup.teamMember.id}`), {
          method: 'PATCH',
          body: JSON.stringify({ role: 'director' }),
        })
        onDone(
          { id: lookup.teamMember.id, name: lookup.teamMember.name ?? '', orcid: lookup.orcid },
          employment,
        )
        return
      }
      const { doc } = await request<{ doc: { id: string; name?: string } }>(api('/team'), {
        method: 'POST',
        body: JSON.stringify({
          firstName: person.firstName,
          lastName: person.lastName,
          title: person.title,
          orcid: lookup.orcid,
          role: 'director',
          displayInWebsite: true,
          affiliationLabel: employment?.organization,
        }),
      })
      onDone({ id: doc.id, name: doc.name ?? '', orcid: lookup.orcid }, employment)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="labkit-onboarding__panel">
      <h2>Who leads the Lab?</h2>
      <p>
        Enter the PI&apos;s ORCID iD. LabKit reads their public ORCID record to fill in the
        Lab&apos;s institution, and later to find their Publications.
      </p>
      {pi && !lookup && (
        <Banner type="success">
          {pi.name || 'The PI'} ({pi.orcid}) is set up as the Lab&apos;s Director.
        </Banner>
      )}
      <div className="labkit-onboarding__inline">
        <TextInput
          path="orcid"
          label="ORCID iD"
          placeholder="0000-0002-1825-0097"
          value={orcidInput}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setOrcidInput(event.target.value)
          }
        />
        <Button buttonStyle="secondary" disabled={busy || !orcidInput.trim()} onClick={find}>
          Look up
        </Button>
      </div>

      {lookup && lookup.teamMember && (
        <Banner type="brand">
          {lookup.teamMember.name || 'A Team Member'} already has this ORCID iD. They will be linked
          as the PI and their role set to Director; the rest of their record is left as it is.
        </Banner>
      )}

      {lookup && !lookup.teamMember && (
        <div className="labkit-onboarding__grid">
          <TextInput
            path="firstName"
            label="First name"
            required
            value={person.firstName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPerson({ ...person, firstName: event.target.value })
            }
          />
          <TextInput
            path="lastName"
            label="Last name"
            required
            value={person.lastName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPerson({ ...person, lastName: event.target.value })
            }
          />
          <TextInput
            path="title"
            label="Title"
            required
            placeholder="Professor"
            value={person.title}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPerson({ ...person, title: event.target.value })
            }
          />
        </div>
      )}

      {lookup && employments.length > 0 && (
        <fieldset className="labkit-onboarding__choices">
          <legend>Which appointment is the Lab part of?</legend>
          {employments.map((job, index) => (
            <label key={`${job.organization}-${index}`}>
              <input
                type="radio"
                name="employment"
                checked={index === employmentIndex}
                onChange={() => {
                  setEmploymentIndex(index)
                  if (job.roleTitle) setPerson((current) => ({ ...current, title: job.roleTitle! }))
                }}
              />
              <span>
                <strong>{job.organization}</strong>
                {job.department ? `, ${job.department}` : ''}
                <small>
                  {[job.roleTitle, [job.city, job.country].filter(Boolean).join(', ')]
                    .filter(Boolean)
                    .join(' · ')}
                  {` · ${job.startYear ?? '?'}–${job.current ? 'present' : (job.endYear ?? '?')}`}
                </small>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <Actions>
        {pi && !lookup && <Button onClick={() => onDone(pi, null)}>Continue</Button>}
        {lookup && (
          <Button
            disabled={
              busy || (!lookup.teamMember && !(person.firstName && person.lastName && person.title))
            }
            onClick={save}
          >
            {lookup.teamMember ? 'Link and continue' : 'Add the PI and continue'}
          </Button>
        )}
      </Actions>
    </section>
  )
}

function LabInfoStep({
  api,
  labInfo,
  onChange,
  onBack,
  onDone,
}: {
  api: (path: string) => string
  labInfo: LabInfoForm
  onChange: (next: LabInfoForm) => void
  onBack: () => void
  onDone: () => void
}) {
  const [busy, setBusy] = useState(false)
  const field =
    (key: keyof Omit<LabInfoForm, 'logo'>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...labInfo, [key]: event.target.value })

  const uploadLogo = async (file: File) => {
    setBusy(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('_payload', JSON.stringify({ alt: `${labInfo.name || 'Lab'} logo` }))
      const { doc } = await request<{ doc: { id: string; url?: string; filename?: string } }>(
        api('/media'),
        { method: 'POST', body: form },
      )
      onChange({
        ...labInfo,
        logo: { id: doc.id, url: doc.url ?? null, filename: doc.filename ?? null },
      })
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const save = async () => {
    setBusy(true)
    try {
      await request(api('/globals/lab-info'), {
        method: 'POST',
        body: JSON.stringify({
          name: labInfo.name,
          shortName: labInfo.shortName || null,
          headline: labInfo.headline || null,
          description: labInfo.description || null,
          email: labInfo.email || null,
          parentOrganization: { name: labInfo.institution, department: labInfo.department },
          location: { city: labInfo.city, country: labInfo.country },
          logo: labInfo.logo?.id ?? null,
        }),
      })
      onDone()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="labkit-onboarding__panel">
      <h2>About the Lab</h2>
      <p>
        This is what the site&apos;s header, home page and search results show. You can change it
        later in Lab Info.
      </p>
      <div className="labkit-onboarding__grid">
        <TextInput
          path="name"
          label="Lab name"
          required
          value={labInfo.name}
          onChange={field('name')}
        />
        <TextInput
          path="shortName"
          label="Short name"
          placeholder="Acronym, if the Lab has one"
          value={labInfo.shortName}
          onChange={field('shortName')}
        />
        <TextInput
          path="headline"
          label="Headline"
          placeholder="One line on what the Lab does"
          value={labInfo.headline}
          onChange={field('headline')}
        />
        <TextInput
          path="email"
          label="Contact email"
          value={labInfo.email}
          onChange={field('email')}
        />
        <TextInput
          path="institution"
          label="Institution"
          value={labInfo.institution}
          onChange={field('institution')}
        />
        <TextInput
          path="department"
          label="Department"
          value={labInfo.department}
          onChange={field('department')}
        />
        <TextInput path="city" label="City" value={labInfo.city} onChange={field('city')} />
        <TextInput
          path="country"
          label="Country"
          value={labInfo.country}
          onChange={field('country')}
        />
      </div>
      <TextareaInput
        path="description"
        label="Description"
        description="One or two sentences, used for search engines."
        value={labInfo.description}
        onChange={field('description')}
      />
      <div className="labkit-onboarding__logo">
        <span className="labkit-onboarding__label">Logo</span>
        {labInfo.logo?.url && <img src={labInfo.logo.url} alt="" />}
        {labInfo.logo && !labInfo.logo.url && <span>{labInfo.logo.filename}</span>}
        <input
          type="file"
          accept="image/*"
          aria-label="Upload a logo"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void uploadLogo(file)
          }}
        />
      </div>
      <Actions>
        <Button buttonStyle="secondary" onClick={onBack}>
          Back
        </Button>
        <Button disabled={busy || !labInfo.name.trim()} onClick={save}>
          Save and continue
        </Button>
      </Actions>
    </section>
  )
}

function FeaturesStep({
  api,
  features,
  onChange,
  onBack,
  onDone,
}: {
  api: (path: string) => string
  features: LabFeatures
  onChange: (next: LabFeatures) => void
  onBack: () => void
  onDone: () => void
}) {
  const [busy, setBusy] = useState(false)
  const save = async () => {
    setBusy(true)
    try {
      await request(api('/globals/features'), { method: 'POST', body: JSON.stringify(features) })
      onDone()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="labkit-onboarding__panel">
      <h2>What the site shows</h2>
      <p>
        Publications and Team are always on. Switch on the modules this Lab uses; you can change
        this any time in Features. Switching one off hides it but keeps its records.
      </p>
      <div className="labkit-onboarding__features">
        {(Object.keys(FEATURE_TEXT) as FeatureName[]).map((name) => (
          <CheckboxInput
            key={name}
            id={`feature-${name}`}
            checked={features[name]}
            onToggle={(event) => onChange({ ...features, [name]: event.target.checked })}
            Label={
              <label htmlFor={`feature-${name}`}>
                <strong>{FEATURE_TEXT[name].label}</strong>
                <small>{FEATURE_TEXT[name].help}</small>
              </label>
            }
          />
        ))}
      </div>
      <Actions>
        <Button buttonStyle="secondary" onClick={onBack}>
          Back
        </Button>
        <Button disabled={busy} onClick={save}>
          Save and continue
        </Button>
      </Actions>
    </section>
  )
}

function ImportStep({
  adminRoute,
  api,
  orcid,
  run,
  onRun,
  onBack,
  onDone,
}: {
  adminRoute: string
  api: (path: string) => string
  orcid: string
  run: RunState | null
  onRun: (run: RunState) => void
  onBack: () => void
  onDone: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [since, setSince] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [stalled, setStalled] = useState(false)

  // A finished or failed run from an earlier visit stays on screen; a staged run
  // for a different ORCID iD (the PI was changed) is ignored.
  const current = run && (run.orcidId === orcid || run.status !== 'staged') ? run : null
  const sinceYear = Number.parseInt(since, 10)
  const visible = useMemo(
    () =>
      (current?.status === 'staged' ? current.candidates : []).filter(
        // Undated works stay visible: there's nothing to judge them by (as in the CLI).
        (candidate) =>
          !Number.isFinite(sinceYear) || !candidate.year || candidate.year >= sinceYear,
      ),
    [current, sinceYear],
  )
  const chosen = visible.filter((candidate) => selected.has(candidate.key))

  const stage = async () => {
    setBusy(true)
    try {
      onRun(
        await request<RunState>(api('/labkit/onboarding/import/stage'), {
          method: 'POST',
          body: JSON.stringify({ orcid }),
        }),
      )
      setSelected(new Set())
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const start = async () => {
    if (!current) return
    setBusy(true)
    try {
      onRun(
        await request<RunState>(api('/labkit/onboarding/import/start'), {
          method: 'POST',
          body: JSON.stringify({
            runId: current.id,
            keys: chosen.map((candidate) => candidate.key),
            since: Number.isFinite(sinceYear) ? sinceYear : null,
          }),
        }),
      )
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setBusy(false)
    }
  }

  // Drive the queue while the run is running, one batch per request. Also
  // resumes a run that was in progress when the page was reloaded.
  const runId = current?.id
  const running = current?.status === 'running'
  useEffect(() => {
    if (!running || !runId) return
    // Per-effect flag, not a shared ref: a remount (StrictMode, fast refresh)
    // cancels this loop and starts its own.
    let cancelled = false
    void (async () => {
      let lastProcessed = -1
      let lastChange = Date.now()
      while (!cancelled) {
        try {
          const next = await request<RunState>(api('/labkit/onboarding/import/tick'), {
            method: 'POST',
            body: JSON.stringify({ runId }),
          })
          if (cancelled) break
          onRun(next)
          if (next.status !== 'running') break
          const processedNow = next.progress?.processed ?? 0
          if (processedNow !== lastProcessed) {
            lastProcessed = processedNow
            lastChange = Date.now()
          }
        } catch {
          // A timed-out or dropped request: the run checkpoints per Candidate, so just retry.
        }
        // A batch that died is picked up by its watchdog job about five minutes
        // later, so only call it stalled after longer than a normal batch takes.
        setStalled(Date.now() - lastChange > 2 * 60_000)
        await sleep(1500)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [api, onRun, runId, running])

  const progress = current?.progress
  const total = progress?.total ?? 0
  const processed = progress?.processed ?? 0
  const reviewHref = current
    ? `${adminRoute}/collections/review-items?where[and][0][run][equals]=${current.id}&where[and][1][status][equals]=open`
    : ''

  return (
    <section className="labkit-onboarding__panel">
      <h2>Import the Lab&apos;s Publications</h2>
      <p>
        An ORCID record covers the PI&apos;s whole career, not only this Lab&apos;s work, so nothing
        is selected. Tick the works the Lab claims as its own. LabKit then looks each one up by DOI
        and creates the Publication, its Venue and its authors. Co-authors it can&apos;t match
        safely are created hidden, and anything uncertain becomes a Review Item.
      </p>

      {!current && (
        <Actions>
          <Button buttonStyle="secondary" onClick={onBack}>
            Back
          </Button>
          <Button disabled={busy} onClick={stage}>
            {busy ? 'Fetching works…' : `Fetch works from ORCID ${orcid}`}
          </Button>
          <Button buttonStyle="ghost" onClick={onDone}>
            Skip for now
          </Button>
        </Actions>
      )}

      {current?.status === 'staged' && (
        <>
          <div className="labkit-onboarding__inline">
            <TextInput
              path="since"
              label="Since year"
              placeholder="e.g. 2017"
              value={since}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSince(event.target.value)
              }
            />
            <span>
              {visible.length} of {current.candidates.length} works shown · {chosen.length} selected
            </span>
            <Button
              buttonStyle="secondary"
              onClick={() =>
                setSelected(new Set(visible.filter((c) => c.doi).map((candidate) => candidate.key)))
              }
            >
              Select all shown
            </Button>
            <Button buttonStyle="ghost" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
          <table className="labkit-onboarding__table">
            <thead>
              <tr>
                <th aria-label="Import" />
                <th>Year</th>
                <th>Title</th>
                <th>DOI</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((candidate) => (
                <tr key={candidate.key} className={candidate.doi ? undefined : 'is-disabled'}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Import ${candidate.title}`}
                      disabled={!candidate.doi}
                      checked={selected.has(candidate.key)}
                      onChange={(event) => {
                        const next = new Set(selected)
                        if (event.target.checked) next.add(candidate.key)
                        else next.delete(candidate.key)
                        setSelected(next)
                      }}
                    />
                  </td>
                  <td>{candidate.year ?? '—'}</td>
                  <td>{candidate.title}</td>
                  <td>
                    {candidate.doi ?? <small>No DOI: add it by hand or by BibTeX later</small>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Actions>
            <Button buttonStyle="secondary" onClick={onBack}>
              Back
            </Button>
            <Button disabled={busy || chosen.length === 0} onClick={start}>
              Import {chosen.length} {chosen.length === 1 ? 'work' : 'works'}
            </Button>
          </Actions>
        </>
      )}

      {current?.status === 'running' && (
        <div className="labkit-onboarding__progress" aria-live="polite">
          <progress max={Math.max(total, 1)} value={processed} />
          <p>
            Imported {processed} of {total}. This takes a few seconds per work. You can leave this
            page; the import picks up again when you come back.
          </p>
          {stalled && (
            <Banner type="warning">
              No progress for a while. If a batch stopped, LabKit picks the import up again within
              about five minutes; keep this page open.
            </Banner>
          )}
        </div>
      )}

      {(current?.status === 'completed' || current?.status === 'failed') && (
        <>
          <Banner type={current.status === 'completed' ? 'success' : 'danger'}>
            {current.status === 'completed'
              ? `Import finished: ${progress?.created ?? 0} created, ${progress?.skippedExisting ?? 0} already there, ${progress?.failed ?? 0} need a look.`
              : `The import stopped: ${current.error ?? 'unknown error'}`}
          </Banner>
          <ul className="labkit-onboarding__links">
            <li>
              <a href={`${adminRoute}/collections/publications`}>See the Publications</a>
            </li>
            <li>
              <a href={`${adminRoute}/collections/import-runs/${current.id}`}>See the Import Run</a>
            </li>
            {(current.openReviewItems ?? 0) > 0 && (
              <li>
                <a href={reviewHref}>
                  {current.openReviewItems} open Review{' '}
                  {current.openReviewItems === 1 ? 'Item' : 'Items'} from this import
                </a>
              </li>
            )}
          </ul>
          <Actions>
            {current.status === 'failed' && (
              <Button buttonStyle="secondary" disabled={busy} onClick={stage}>
                Start again
              </Button>
            )}
            <Button onClick={onDone}>Continue</Button>
          </Actions>
        </>
      )}
    </section>
  )
}

function DoneStep({
  adminRoute,
  api,
  run,
}: {
  adminRoute: string
  api: (path: string) => string
  run: RunState | null
}) {
  const [busy, setBusy] = useState(false)
  const finish = async () => {
    setBusy(true)
    try {
      await request(api('/globals/lab-info'), {
        method: 'POST',
        body: JSON.stringify({ onboardingCompleted: true }),
      })
      window.location.assign(adminRoute)
    } catch (error) {
      toast.error((error as Error).message)
      setBusy(false)
    }
  }

  return (
    <section className="labkit-onboarding__panel">
      <h2>Your Lab is set up</h2>
      <p>
        The site now shows the Lab&apos;s details
        {run?.status === 'completed' ? ' and the Publications you imported' : ''}. Take a look, then
        finish: the dashboard keeps a short checklist of what&apos;s left, such as Team photos,
        Research Themes and the review queue.
      </p>
      <Actions>
        <Button el="anchor" url="/" newTab buttonStyle="secondary">
          View your site
        </Button>
        <Button disabled={busy} onClick={finish}>
          Finish setup
        </Button>
      </Actions>
    </section>
  )
}
