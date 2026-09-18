import 'server-only'
import { PUBLIC_APPS } from '@/lib/registry/apps'
import { securityResponses } from './knowledge/rpsleague/securityResponses'
import { retrieveRelevantChunks } from './rag/retriever'

const APP_DISPLAY_NAMES: Record<string, string> = {
  rps: 'RPS League',
  network: 'Arkalon Core',
  daily: 'Arkalon Daily',
  labs: 'Arkalon Labs'
}

export async function buildContext(
  query: string,
  turnCount: number = 1
): Promise<{ context: string; source: string }> {
  const activeApps = PUBLIC_APPS.filter(
    (app) => app.status === 'online' || app.status === 'development'
  )
  const upcomingApps = PUBLIC_APPS.filter((app) => app.status === 'coming_soon')

  const relevantChunks = retrieveRelevantChunks(query, 3)

  const primaryChunk = relevantChunks[0]
  const source = primaryChunk
    ? (APP_DISPLAY_NAMES[primaryChunk.appSlug] ?? 'Arkalon Codex')
    : 'Arkalon Telemetry'

  // Prevent follow-up questions after the final consultation turn
  const turnGuidance =
    turnCount >= 3
      ? `<turn_guidance status="FINAL_TURN">
      This is Turn 3 of 3 (FINAL TURN OF CONSULTATION). Deliver your definitive conclusion or summary.
      CRITICAL HARD RULE: DO NOT ask any follow-up questions, do NOT ask the user what they want to analyze, and do NOT prompt for more input. The consultation sequence terminates after this message.
      </turn_guidance>`
      : `<turn_guidance status="ACTIVE_TURN">
      This is Turn ${turnCount} of 3. You may provide your answer and ask at most ONE concise clarifying question if needed.
      </turn_guidance>`

  const context = `
      ${turnGuidance}

      <ecosystem_overview>
        <active_applications>
          ${activeApps.map((app) => `<app slug="${app.slug}" name="${app.name}" status="${app.status}">${app.shortDescription}</app>`).join('\n    ')}
        </active_applications>
        <upcoming_applications>
          ${upcomingApps.map((app) => `<app slug="${app.slug}" name="${app.name}">${app.shortDescription}</app>`).join('\n    ')}
        </upcoming_applications>
      </ecosystem_overview>

      <security_protocols>
      ${securityResponses}
      </security_protocols>

      <retrieved_knowledge>
      ${relevantChunks
        .map(
          (chunk) => `
      <knowledge_section id="${chunk.id}" title="${chunk.title}">
      ${chunk.content}
      </knowledge_section>`
        )
        .join('\n')}
      </retrieved_knowledge>
        `.trim()

  return { context, source }
}
