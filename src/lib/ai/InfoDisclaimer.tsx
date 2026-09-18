'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'

export function InfoDisclaimer() {
  const [show, setShow] = useState(false)

  return (
    <div className="relative group flex items-center">
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        onBlur={() => setShow(false)}
        className="p-1 text-zinc-500 hover:text-indigo-400 transition-colors outline-none cursor-pointer"
        aria-label="Privacy information"
      >
        <Info size={13} />
      </button>

      {/* Popover Tooltip */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5
          w-48 sm:w-56 p-2.5 rounded-lg border shadow-2xl text-[10px] sm:text-[11px] font-mono leading-relaxed text-center z-50 transition-all duration-150
          ${show ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}
          sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto sm:group-hover:scale-100`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-default)',
          color: 'var(--text-secondary)'
        }}
      >
        Prompts are logged for safety monitoring. IP addresses are masked and no
        personal data is stored.
      </div>
    </div>
  )
}
