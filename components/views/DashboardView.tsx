'use client'

import { useEditorStore } from '@/lib/store'

function MetricCard({ label, value, accent, delay }: { label: string; value: string; accent?: boolean; delay: string }) {
  return (
    <div className={`card animate-fade-in`} style={{
      padding: '1.25rem 1.5rem',
      animationDelay: delay,
    }}>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.65rem',
        letterSpacing: '0.15em',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '2rem',
        fontWeight: 700,
        color: accent ? 'var(--color-accent)' : 'var(--color-text)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>{value}</div>
    </div>
  )
}

function SectionCard({ kicker, title, body, targetView, delay }: {
  kicker: string; title: string; body: string; targetView: string; delay: string
}) {
  const setCurrentView = useEditorStore(s => s.setCurrentView)
  return (
    <div className="card-plain animate-fade-in" style={{
      padding: '1.25rem 1.5rem',
      animationDelay: delay,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
    }}>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        color: 'var(--color-accent)',
        textTransform: 'uppercase',
      }}>{kicker}</div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--color-text)',
        letterSpacing: '0.04em',
      }}>{title}</div>
      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)',
        flex: 1,
        marginBottom: '0.75rem',
      }}>{body}</div>
      <button
        className="btn btn-ghost"
        style={{ alignSelf: 'flex-start', fontSize: '0.72rem', letterSpacing: '0.06em' }}
        onClick={() => setCurrentView(targetView as never)}
      >
        OPEN →
      </button>
    </div>
  )
}

export default function DashboardView() {
  const { getRunStats, getPlayers, getSaveStateLabel } = useEditorStore()
  const stats = getRunStats()
  const players = getPlayers()

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Title */}
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.62rem',
          letterSpacing: '0.25em',
          color: 'var(--color-accent)',
          textTransform: 'uppercase',
          marginBottom: '0.3rem',
        }}>OPERATIONS CENTER</div>
        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.75rem',
          fontWeight: 700,
          margin: 0,
          color: 'var(--color-text)',
        }}>Dashboard</h1>
      </div>

      {/* Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <MetricCard label="Level" value={String(stats.level ?? 0)} accent delay="0.04s" />
        <MetricCard label="Currency" value={String(stats.currency ?? 0)} delay="0.08s" />
        <MetricCard label="Players" value={String(players.length)} delay="0.12s" />
        <MetricCard label="Save State" value={getSaveStateLabel()} delay="0.16s" />
      </div>

      {/* Section cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        <SectionCard kicker="RUN" title="Run Overview" body="Edit level, currency, and save state for your current run." targetView="overview" delay="0.2s" />
        <SectionCard kicker="CREW" title="Players" body="Manage HP, upgrades, and bulk apply stats across your squad." targetView="players" delay="0.24s" />
        <SectionCard kicker="LOADOUT" title="Items & Inventory" body="Browse the full catalog, add or remove items from the truck." targetView="items" delay="0.28s" />
        <SectionCard kicker="POWER" title="Truck / Power" body="Manage Power Crystals and spawn state for the next session." targetView="truck" delay="0.32s" />
      </div>
    </div>
  )
}
