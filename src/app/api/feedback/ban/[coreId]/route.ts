import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ coreId: string }> }
) {
  const { coreId } = await params
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  if (!key || key !== process.env.FEEDBACK_ADMIN_KEY) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await pool.query(
      'INSERT INTO feedback_bans (core_id, banned_at) VALUES ($1, NOW()) ON CONFLICT (core_id) DO NOTHING',
      [coreId]
    )

    const safeId = String(coreId).replace(/</g, '&lt;')

    return new NextResponse(
      `<html><body style="font-family:monospace;text-align:center;padding:50px;background:#0a0a0f;color:#e4e4e7;"><h2>✅ User Banned from Feedback</h2><p>${safeId}</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err) {
    console.error('[Feedback Ban]', err)
    return new NextResponse('DB Error', { status: 500 })
  }
}
