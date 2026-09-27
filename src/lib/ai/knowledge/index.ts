import 'server-only'
import { NETWORK_KNOWLEDGE } from './network'
import { RPS_LEAGUE_KNOWLEDGE } from './rpsleague'
import { DAILY_KNOWLEDGE } from './daily/daily'

export const COMBINED_KNOWLEDGE = `
${NETWORK_KNOWLEDGE}

${DAILY_KNOWLEDGE}

${RPS_LEAGUE_KNOWLEDGE}
`.trim()
