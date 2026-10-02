import { NextRequest, NextResponse } from 'next/server'
import { banCoreId, BanFeature } from '@/lib/bans'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ feature: string; coreId: string }> }
) {
  const { feature, coreId } = await params
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  if (!key || key !== process.env.FEEDBACK_ADMIN_KEY) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (feature !== 'feedback' && feature !== 'ai') {
    return new NextResponse('Invalid feature', { status: 400 })
  }

  try {
    await banCoreId(coreId, feature as BanFeature)

    const safeId = String(coreId).replace(/</g, '&lt;')

    return new NextResponse(
      `<html><body style="font-family:monospace;text-align:center;padding:50px;background:#0a0a0f;color:#e4e4e7;"><h2>✅ User Banned from ${feature.toUpperCase()}</h2><p>${safeId}</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (err) {
    console.error('[Ban Route Error]', err)
    return new NextResponse('DB Error', { status: 500 })
  }
}
