import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { validateOwnership } from '@/lib/identity/validateOwnership'

export async function GET() {
  try {
    const ownership = await validateOwnership()
    if (!ownership.valid) {
      return NextResponse.json({ banned: false })
    }

    const result = await pool.query(
      'SELECT 1 FROM feedback_bans WHERE core_id = $1',
      [ownership.coreId]
    )

    return NextResponse.json({
      banned: result.rowCount !== null && result.rowCount > 0
    })
  } catch (err) {
    console.error('[Feedback Status]', err)
    return NextResponse.json({ banned: false })
  }
}
