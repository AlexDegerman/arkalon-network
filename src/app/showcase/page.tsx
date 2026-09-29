import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false
  },
  title: 'Arkalon Ecosystem Showcase',
  description:
    'Architecture and live production walkthrough of the Arkalon multi-application ecosystem.',
  openGraph: {
    title: 'Arkalon Ecosystem Showcase',
    description:
      'Video demonstration and architecture showcase of Arkalon Network, RPS League, and Arkalon Daily.',
    url: 'https://network.rpsleague.fi/showcase',
    siteName: 'Arkalon Network',
    images: [
      {
        url: 'https://network.rpsleague.fi/brand/network.png',
        width: 320,
        height: 670,
        alt: 'Arkalon Ecosystem Showcase'
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
}

interface ShowcaseAppCardProps {
  name: string
  titleClass: string
  category: string
  description: string
  href: string
}

function ShowcaseAppCard({
  name,
  titleClass,
  category,
  description,
  href
}: ShowcaseAppCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col justify-between rounded-xl border p-4 sm:p-5 transition-all duration-200 hover:scale-[1.01] hover:border-(--border-active) cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-(--text-muted)">
            {category}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-(--status-online)/10 border border-(--status-online)/30">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--status-online)' }}
            />
            <span
              className="text-[9px] font-mono font-bold tracking-wider leading-none"
              style={{ color: 'var(--status-online)' }}
            >
              ONLINE
            </span>
          </span>
        </div>

        <h3
          className={`text-base sm:text-lg font-black tracking-wide mb-1.5 ${titleClass}`}
        >
          {name}
        </h3>
        <p className="text-xs text-(--text-secondary) leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-(--border-default) flex items-center justify-between text-xs font-mono font-bold text-(--text-muted) group-hover:text-white transition-colors">
        <span>LAUNCH SYSTEM</span>
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </a>
  )
}

export default function ShowcasePage() {
  return (
    <main className="min-h-screen w-full px-4 py-8 sm:py-14 flex flex-col items-center justify-between relative z-10">
      {/* Top Header */}
      <header className="max-w-4xl w-full text-center flex flex-col items-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-(--border-default) bg-(--bg-surface) mb-4">
          <ShieldCheck size={13} style={{ color: 'var(--accent-network)' }} />
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-(--text-secondary)">
            Production Architecture & Telemetry
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight select-none mb-3">
          <span className="g-dqgs">ARKALON ECOSYSTEM</span>
          <br className="sm:hidden" />
          <span className="text-white sm:ml-3">SHOWCASE</span>
        </h1>

        <p className="text-xs sm:text-sm text-(--text-secondary) max-w-2xl leading-relaxed">
          A multi-application universe unified by zero-friction root identity,
          real-time Server-Sent Events, BigInt mathematics, and deterministic
          daily challenge engines.
        </p>
      </header>

      {/* Phone Mockup Video Player (Centered, exact 320x670 aspect ratio) */}
      <section className="w-full flex justify-center mb-10 sm:mb-14">
        <div
          className="relative w-full max-w-[320px] sm:max-w-90 aspect-320/670 rounded-[2.2rem] overflow-hidden border-2 sm:border-4 bg-black shadow-2xl"
          style={{
            borderColor: 'var(--border-active)',
            boxShadow: '0 0 50px rgba(99, 102, 241, 0.2)'
          }}
        >
          <video
            controls
            playsInline
            preload="metadata"
            poster="/brand/showcase.png"
            className="w-full h-full object-contain bg-black"
          >
            <source src="/brand/showcase.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Production Satellite Applications */}
      <section className="max-w-4xl w-full mb-14">
        <div className="text-center mb-5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-(--text-muted)">
            Connected Live Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ShowcaseAppCard
            name="ARKALON NETWORK"
            titleClass="g-dqgs"
            category="SSO & Identity Hub"
            description="Master identity authority issuing cryptographic mnemonic recovery codes, 3-word handles, and dual-cookie root SSO."
            href="https://network.rpsleague.fi"
          />

          <ShowcaseAppCard
            name="RPS LEAGUE"
            titleClass="title-rps"
            category="Live High-Frequency Arena"
            description="5-second prediction cycles with SSE event broadcasts, astronomical BigInt multiplier scaling, and World Boss raids."
            href="https://rpsleague.fi"
          />

          <ShowcaseAppCard
            name="ARKALON DAILY"
            titleClass="title-daily"
            category="Cognitive Puzzle Platform"
            description="Five daily logic challenges generated from deterministic HMAC-SHA256 seeds with server-authoritative scoring."
            href="https://daily.rpsleague.fi"
          />
        </div>
      </section>

      <footer className="w-full max-w-4xl border-t border-(--border-default) pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-(--text-muted)">
        <div>
          <span>Arkalon Systems Architecture &middot; </span>
          <span className="text-(--text-primary)">Independent Engineering</span>
        </div>

        <Link
          href="/"
          className="text-(--accent-network) hover:underline font-bold"
        >
          Ecosystem Directory &rarr;
        </Link>
      </footer>
    </main>
  )
}
