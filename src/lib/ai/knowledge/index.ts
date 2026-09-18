import 'server-only'
import { networkKnowledge } from './network'
import { GAME_KNOWLEDGE } from './rpsleague'

export const COMBINED_KNOWLEDGE = `
${networkKnowledge}

${GAME_KNOWLEDGE}
`.trim()
