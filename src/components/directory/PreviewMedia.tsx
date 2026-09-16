type Props = {
  url: string
  appName: string
}

export function PreviewMedia({ url, appName }: Props) {
  return (
    <div
      className="w-full overflow-hidden rounded-md"
      style={{ backgroundColor: 'var(--border-default)' }}
    >
      <img
        src={url}
        alt={`${appName} preview`}
        loading="lazy"
        decoding="async"
        className="w-full h-auto block"
        style={{ maxHeight: '320px', objectFit: 'cover' }}
      />
    </div>
  )
}