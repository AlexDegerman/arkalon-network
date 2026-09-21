import { NextResponse } from 'next/server'
import { generateNickname } from '@/lib/identity/nicknames'
import { updateNickname } from '@/lib/identity/coreId'

export async function POST(req: Request) {
  const authHeader = req.headers.get('x-internal-secret')
  if (authHeader !== process.env.INTERNAL_SERVICE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { coreId } = await req.json()
    if (!coreId) {
      return NextResponse.json({ error: 'Missing coreId' }, { status: 400 })
    }

    const newNickname = generateNickname()
    await updateNickname(coreId, newNickname)

    return NextResponse.json({ success: true, nickname: newNickname })
  } catch (err) {
    console.error('[API /identity/reroll]', err)
    return NextResponse.json(
      { error: 'Failed to reroll nickname' },
      { status: 500 }
    )
  }
}
