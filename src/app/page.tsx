import { PUBLIC_APPS } from '@/lib/registry/apps'
import { AppCard } from '@/components/directory/AppCard'
import { Header } from '@/components/layout/Header'

export default function HomePage() {
  return (
    <main
      className="mx-auto w-full max-w-160 px-4 py-8 min-h-screen flex flex-col"
      id="applications"
    >
      <Header />

      <section
        aria-label="Application directory"
        className="flex flex-col gap-3 flex-1"
      >
        {PUBLIC_APPS.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </section>

    </main>
  )
}
