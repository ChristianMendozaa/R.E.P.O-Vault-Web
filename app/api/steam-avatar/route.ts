import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return Response.json({ error: 'Missing id' }, { status: 400 })
  }
  try {
    const xmlRes = await fetch(`https://steamcommunity.com/profiles/${id}/?xml=1`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 },
    })
    const xml = await xmlRes.text()
    const match = xml.match(/<avatarIcon><!\[CDATA\[(.+?)\]\]><\/avatarIcon>/)
    if (!match) return Response.json({ error: 'Avatar not found' }, { status: 404 })

    const imgRes = await fetch(match[1])
    if (!imgRes.ok) return Response.json({ error: 'Image fetch failed' }, { status: 502 })

    const imgBuffer = await imgRes.arrayBuffer()
    return new Response(imgBuffer, {
      headers: {
        'Content-Type': imgRes.headers.get('content-type') ?? 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return Response.json({ error: 'Steam fetch failed' }, { status: 502 })
  }
}
