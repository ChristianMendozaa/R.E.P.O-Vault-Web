'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/lib/store'
import { SaveData } from '@/lib/types'

export default function FileUpload() {
  const router = useRouter()
  const loadSave = useEditorStore(s => s.loadSave)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [protocol, setProtocol] = useState(false)

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.es3')) {
      setError('Invalid file — must be a .es3 save file')
      return
    }
    setLoading(true)
    setError(null)
    setProtocol(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/decrypt', { method: 'POST', body: form })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? 'Decryption failed')
      loadSave(json.data as SaveData, file.name)
      router.push('/editor')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
      setProtocol(false)
    }
  }, [loadSave, router])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div>
      <label
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          display: 'block',
          background: dragging ? 'rgba(200,146,42,0.07)' : 'var(--color-surface)',
          border: `2px dashed ${dragging ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
          borderRadius: '14px',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: loading ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Scan line on drag */}
        {dragging && (
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
            animation: 'scanDrift 1.2s linear infinite',
            top: 0,
          }} />
        )}

        <input
          type="file"
          accept=".es3"
          onChange={onFileChange}
          disabled={loading}
          style={{ display: 'none' }}
        />

        {loading ? (
          <div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.72rem',
              letterSpacing: '0.2em',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}>
              {protocol ? 'DECRYPTION PROTOCOL INITIATED' : 'PROCESSING...'}
              <span className="cursor-blink">_</span>
            </div>
            <div className="progress-track" style={{ height: '4px', maxWidth: '240px', margin: '0 auto' }}>
              <div className="shimmer-accent progress-fill" style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>⬆</div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'var(--color-text)',
              marginBottom: '0.4rem',
            }}>
              UPLOAD SAVE FILE
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.04em',
            }}>
              Drag & drop or click to browse
            </div>
            <div style={{
              marginTop: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--color-accent)',
              opacity: 0.7,
            }}>
              .es3 format
            </div>
          </>
        )}
      </label>

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'rgba(140,58,50,0.15)',
          border: '1px solid var(--color-danger)',
          borderRadius: '8px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.82rem',
          color: '#c25b52',
          letterSpacing: '0.03em',
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  )
}
