'use server'

import { validateOwnership } from '@/lib/identity/validateOwnership'
import { generateNickname } from '@/lib/identity/nicknames'
import { updateNickname } from '@/lib/identity/coreId'
import { RerollNicknameResult } from '@/types/identity'

export async function rerollNicknameAction(): Promise<RerollNicknameResult> {
  try {
    const ownership = await validateOwnership()
    if (!ownership.valid) {
      return { status: 'unauthorized' }
    }

    const newNickname = generateNickname()
    await updateNickname(ownership.coreId, newNickname)

    return { status: 'success', nickname: newNickname }
  } catch (err) {
    console.error('[rerollNicknameAction]', err)
    return { status: 'error', message: 'Failed to reroll nickname.' }
  }
}
