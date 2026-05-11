'use client'

import { useState, useMemo } from 'react'
import { useEditorStore } from '@/lib/store'
import { PLAYER_FIELD_METADATA, RootData } from '@/lib/types'

function HpBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-text-muted)', minWidth: '80px' }}>
        {current} / {max}
      </span>
      <div className="progress-track" style={{ flex: 1, height: '6px' }}>
        <div className="progress-fill shimmer-bar" style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--color-text-muted)', minWidth: '60px', textAlign: 'right' }}>
        max {max}
      </span>
    </div>
  )
}

function PlayerAvatar({ playerId, playerName }: { playerId: string; playerName: string }) {
  const [src, setSrc] = useState(`/api/steam-avatar?id=${playerId}`)
  const initials = (() => {
    const parts = playerName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  })()

  return (
    <div style={{
      width: '42px', height: '42px', borderRadius: '50%',
      background: 'var(--color-info)',
      border: '2px solid var(--color-border-strong)',
      overflow: 'hidden',
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img
        src={src}
        alt={playerName}
        width={42} height={42}
        style={{ objectFit: 'cover' }}
        onError={() => setSrc('')}
      />
      {!src && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>
          {initials}
        </span>
      )}
    </div>
  )
}

export default function PlayersView() {
  const { getPlayers, getRootData, updatePlayerField, applyToAllPlayers } = useEditorStore()
  const players = getPlayers()
  const root = getRootData()

  const [bulkFields, setBulkFields] = useState<Record<string, string>>({})

  const bulkHp = parseInt(bulkFields['health'] || '0') || 0
  const bulkUpgrade = parseInt(bulkFields['health_upgrade'] || '0') || 0
  const bulkMaxHp = 100 + bulkUpgrade * 20
  const bulkHpPct = bulkMaxHp > 0 ? Math.min((bulkHp / bulkMaxHp) * 100, 100) : 0

  const totalUpgrades = useMemo(() => (playerId: string) => {
    return PLAYER_FIELD_METADATA.slice(1).reduce((sum, f) => {
      return sum + ((root[f.jsonKey] as Record<string, number>)?.[playerId] ?? 0)
    }, 0)
  }, [root])

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>CREW MANAGEMENT</div>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>Players</h1>
      </div>

      {/* Bulk Apply */}
      <div className="card-alt animate-fade-in stagger-1" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
          APPLY TO ALL PLAYERS
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '1rem', marginTop: 0 }}>
          Fill only the fields you want to push to the full crew. Empty fields are ignored.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
          {PLAYER_FIELD_METADATA.map(f => (
            <div key={f.suffix}>
              <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.08em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                {f.label}
              </label>
              <input
                type="number"
                className="field-input"
                placeholder="—"
                value={bulkFields[f.suffix] ?? ''}
                onChange={e => setBulkFields(prev => ({ ...prev, [f.suffix]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        {/* HP preview */}
        {(bulkFields['health'] || bulkFields['health_upgrade']) && (
          <div style={{ marginBottom: '1rem' }}>
            <HpBar current={bulkHp} max={bulkMaxHp} />
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
              Preview: {bulkHp} HP / max {bulkMaxHp}
            </div>
          </div>
        )}

        <button
          className="btn btn-success"
          onClick={() => {
            applyToAllPlayers(bulkFields)
            setBulkFields({})
          }}
        >
          APPLY TO ALL
        </button>
      </div>

      {/* Player cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {players.map((player, pi) => {
          const healthUpgrade = (root.playerUpgradeHealth?.[player.id] ?? 0)
          const maxHp = 100 + healthUpgrade * 20
          const upgrades = totalUpgrades(player.id)

          return (
            <div key={player.id} className={`card-plain animate-fade-in`} style={{ padding: '1.25rem', animationDelay: `${0.05 * pi}s` }}>
              {/* Player header */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <PlayerAvatar playerId={player.id} playerName={player.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>{player.name}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Steam ID {player.id}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span className="badge badge-success">HP {player.health}</span>
                    <span className="badge badge-accent">Upgrades {upgrades}</span>
                  </div>
                  <HpBar current={player.health} max={maxHp} />
                </div>
              </div>

              {/* Fields grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.6rem' }}>
                {PLAYER_FIELD_METADATA.map(f => {
                  const dict = root[f.jsonKey] as Record<string, number> | undefined
                  const val = dict?.[player.id] ?? 0
                  return (
                    <div key={f.suffix}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                        <label style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.08em', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          {f.label}
                        </label>
                        {f.capText && (
                          <span className={`badge ${f.capColor === 'danger' ? 'badge-danger' : f.capColor === 'accent' ? 'badge-accent' : 'badge-success'}`}>
                            {f.capText}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        className="field-input"
                        defaultValue={val}
                        min={0}
                        onChange={e => updatePlayerField(player.id, f.jsonKey, parseInt(e.target.value) || 0)}
                      />
                      {f.description && (
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0' }}>
                          {f.description}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
