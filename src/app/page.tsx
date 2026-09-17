import { Header } from '@/components/layout/Header'
import { AppDirectory } from '@/components/directory/AppDirectory'

export default function HomePage() {
  return (
    <main
      className="mx-auto w-full max-w-160 px-4 py-8 min-h-screen flex flex-col"
      id="applications"
    >
      <Header />
      <AppDirectory />
    </main>
  )
}
