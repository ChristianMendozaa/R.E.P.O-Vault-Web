'use client'

import { useEditorStore } from '@/lib/store'

const CRYSTAL_MAX = 10

export default function TruckView() {
  const { getRootData, addItem, removeItem, setSaveLevel, getSaveStateLabel, getRunStats, setStatus } = useEditorStore()
  const root = getRootData()
  const stats = getRunStats()
  const crystals = root.itemsPurchased?.['Item Power Crystal'] ?? 0
  const pct = Math.min((crystals / CRYSTAL_MAX) * 100, 100)

  const handleAdd = () => {
    if (crystals >= CRYSTAL_MAX) {
      setStatus(`Maximum ${CRYSTAL_MAX} crystals reached`, 'warning')
      return
    }
    addItem('Item Power Crystal')
  }

  const handleRemove = () => {
    if (crystals <= 0) return
    removeItem('Item Power Crystal')
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          POWER SYSTEMS
        </div>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
          Truck / Power
        </h1>
      </div>

      {/* Power Crystals panel */}
      <div className="card animate-fade-in stagger-1" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.62rem',
          letterSpacing: '0.2em',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: '0.3rem',
        }}>
          POWER CRYSTALS
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 0, marginBottom: '1.25rem' }}>
          Crystals currently loaded in the truck. Maximum is {CRYSTAL_MAX}.
        </p>

        {/* Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="progress-track" style={{ flex: 1, height: '14px' }}>
            <div
              className="progress-fill shimmer-accent"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--color-accent)',
            minWidth: '60px',
            textAlign: 'right',
          }}>
            {crystals} / {CRYSTAL_MAX}
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-danger"
            style={{ minWidth: '80px', fontSize: '1rem', letterSpacing: '0.05em' }}
            onClick={handleRemove}
            disabled={crystals <= 0}
          >
            − 1
          </button>
          <button
            className="btn btn-success"
            style={{ minWidth: '80px', fontSize: '1rem', letterSpacing: '0.05em' }}
            onClick={handleAdd}
            disabled={crystals >= CRYSTAL_MAX}
          >
            + 1
          </button>
        </div>
      </div>

      {/* Spawn State */}
      <div className="card animate-fade-in stagger-2" style={{ padding: '1.25rem' }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.62rem',
          letterSpacing: '0.2em',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: '0.3rem',
        }}>
          SPAWN STATE
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 0, marginBottom: '0.75rem' }}>
          Adjust whether the save loads in the truck or in the shop. Mirrors the control in Run Overview.
        </p>
        <select
          className="field-input"
          value={stats['save level'] ?? 0}
          onChange={e => setSaveLevel(parseInt(e.target.value) as 0 | 1)}
          style={{ appearance: 'none' }}
        >
          <option value={0}>In-Game / Truck  (save level = 0)</option>
          <option value={1}>Shop  (save level = 1)</option>
        </select>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.4rem 0 0' }}>
          Current: <span style={{ color: 'var(--color-accent)' }}>{getSaveStateLabel()}</span>
        </p>
      </div>
    </div>
  )
}
