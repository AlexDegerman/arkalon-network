type Props = {
  appName: string
}

export function ComingSoonPlaceholder({ appName }: Props) {
  return (
    <div
      className="w-full rounded-md flex flex-col items-center justify-center gap-2 py-10 px-4"
      style={{
        backgroundColor: 'var(--bg-primary)',
        border: '1px dashed var(--border-default)',
        minHeight: '140px'
      }}
      aria-label={`${appName} - coming soon`}
    >
      <span
        className="text-[0.6875rem] font-semibold tracking-widest"
        style={{
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace"
        }}
      >
        COMING SOON
      </span>
      <span
        className="text-[0.8125rem] text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        {appName} is in development.
      </span>
    </div>
  )
}
