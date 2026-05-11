'use client'

import { useEditorStore } from '@/lib/store'

export default function OverviewView() {
  const { getRunStats, updateRunStat, setSaveLevel, getSaveStateLabel } = useEditorStore()
  const stats = getRunStats()

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          RUN DATA
        </div>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
          Run Overview
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Edit level, currency, and save state.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Level */}
        <div className="card animate-fade-in stagger-1" style={{ padding: '1.25rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Level
          </label>
          <input
            type="number"
            className="field-input"
            defaultValue={stats.level ?? 0}
            min={0}
            onChange={e => updateRunStat('level', parseInt(e.target.value) || 0)}
          />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.4rem 0 0' }}>
            Current run level.
          </p>
        </div>

        {/* Currency */}
        <div className="card animate-fade-in stagger-2" style={{ padding: '1.25rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Currency
          </label>
          <input
            type="number"
            className="field-input"
            defaultValue={stats.currency ?? 0}
            min={0}
            onChange={e => updateRunStat('currency', parseInt(e.target.value) || 0)}
          />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.4rem 0 0' }}>
            Available money for purchases and upgrades.
          </p>
        </div>

        {/* Save State */}
        <div className="card animate-fade-in stagger-3" style={{ padding: '1.25rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Save State
          </label>
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
    </div>
  )
}
