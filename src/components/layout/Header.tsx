// Gear icon wired to settings panel in Commit 3.5
export function Header() {
  return (
    <header className="w-full mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[1.75rem] font-bold leading-tight tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            ARKALON NETWORK
          </h1>
          <p
            className="mt-1 text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            The Arkalon application ecosystem.
          </p>
        </div>
      </div>
    </header>
  )
}
