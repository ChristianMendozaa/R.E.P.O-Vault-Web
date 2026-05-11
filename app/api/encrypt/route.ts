import { encryptSave } from '@/lib/crypto'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const jsonData = await req.json()
    const encrypted = encryptSave(jsonData)
    return new Response(new Uint8Array(encrypted), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="save.es3"',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Encryption failed'
    return Response.json({ success: false, error: message }, { status: 422 })
  }
}
