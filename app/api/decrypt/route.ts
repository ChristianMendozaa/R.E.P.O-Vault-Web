import { decryptSave } from '@/lib/crypto'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return Response.json({ success: false, error: 'No file provided' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const jsonData = decryptSave(buffer)
    return Response.json({ success: true, data: jsonData })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Decryption failed'
    return Response.json({ success: false, error: message }, { status: 422 })
  }
}
