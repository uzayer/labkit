export default function DashboardHomePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          LabKit Admin
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          The dashboard shell is wired and ready for the ingestion views that land in the next
          phase.
        </p>
      </div>
    </main>
  )
}
