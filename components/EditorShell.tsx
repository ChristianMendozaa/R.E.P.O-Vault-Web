'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/lib/store'
import { ViewName } from '@/lib/types'

const NAV_ITEMS: { id: ViewName; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'DASHBOARD', icon: '◈' },
  { id: 'overview',  label: 'RUN OVERVIEW', icon: '◎' },
  { id: 'players',   label: 'PLAYERS', icon: '◉' },
  { id: 'items',     label: 'ITEMS', icon: '◆' },
  { id: 'truck',     label: 'TRUCK / POWER', icon: '◧' },
]

export default function EditorShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { fileName, isDirty, currentView, statusMessage, statusTone, jsonData, setCurrentView } = useEditorStore()

  const handleSave = useCallback(async () => {
    if (!jsonData) return
    try {
      const res = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      })
      if (!res.ok) throw new Error('Encryption failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName || 'save.es3'
      a.click()
      URL.revokeObjectURL(url)
      useEditorStore.getState().markSaved()
    } catch {
      useEditorStore.getState().setStatus('Save failed', 'danger')
    }
  }, [jsonData, fileName])

  const handleNewFile = () => {
    router.push('/')
  }

  const toneColor = {
    info: 'var(--color-info)',
    success: 'var(--color-success)',
    warning: '#b8962a',
    danger: 'var(--color-danger)',
  }[statusTone]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        minWidth: '220px',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            marginBottom: '0.2rem',
          }}>
            FIELD TERMINAL
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}>
            R.E.P.O<span style={{ color: 'var(--color-accent)' }}>_</span>VAULT
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const active = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.65rem 1.25rem',
                  background: active ? 'rgba(200,146,42,0.08)' : 'transparent',
                  border: 'none',
                  borderLeftWidth: '3px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: active ? 'var(--color-accent)' : 'transparent',
                  color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '0.9rem', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom: new file */}
        <div style={{ padding: '0 1rem' }}>
          <button
            onClick={handleNewFile}
            className="btn btn-ghost"
            style={{ width: '100%', fontSize: '0.72rem', letterSpacing: '0.06em' }}
          >
            ← OPEN OTHER FILE
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: '52px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          gap: '1rem',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
          }}>
            {fileName || 'No file'}{isDirty ? <span style={{ color: 'var(--color-accent)' }}> *</span> : ''}
          </span>

          {statusMessage && (
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.72rem',
              letterSpacing: '0.05em',
              color: toneColor,
              marginLeft: '0.5rem',
            }}>
              ● {statusMessage}
            </span>
          )}

          <div style={{ flex: 1 }} />

          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="btn btn-accent"
            style={{ fontSize: '0.75rem', letterSpacing: '0.08em', padding: '0.35rem 1.1rem' }}
          >
            SAVE FILE
          </button>
        </header>

        {/* View content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
