'use client'

import { useState, useMemo } from 'react'
import { useEditorStore } from '@/lib/store'
import { STATIC_ITEM_IDS } from '@/constants/items'

const ALL_ITEMS = Object.keys(STATIC_ITEM_IDS).sort()

export default function ItemsView() {
  const { getRootData, addItem, removeItem, haveEverything, getItemTotals, getSaveStateLabel } = useEditorStore()
  const root = getRootData()
  const { total, unique } = getItemTotals()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q ? ALL_ITEMS.filter(n => n.toLowerCase().includes(q)) : ALL_ITEMS
  }, [search])

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.25em', color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          LOADOUT CATALOG
        </div>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
          Items & Inventory
        </h1>
      </div>

      {/* Stats band */}
      <div className="animate-fade-in stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'TOTAL QTY', value: total },
          { label: 'UNIQUE ITEMS', value: unique },
          { label: 'SAVE STATE', value: getSaveStateLabel() },
        ].map(({ label, value }) => (
          <div key={label} className="card-alt" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-accent)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="animate-fade-in stagger-2" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            SEARCH ITEMS
          </label>
          <input
            type="text"
            className="field-input"
            placeholder="Type an item name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div>
          <button className="btn btn-success" onClick={() => haveEverything()}>
            HAVE EVERYTHING
          </button>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', textAlign: 'center' }}>
            Set all 0 → ×1
          </div>
        </div>
      </div>

      {/* Catalog grid */}
      {filtered.length === 0 ? (
        <div className="card-plain" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.3rem' }}>No matching items</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Try another search term.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {filtered.map((itemName, i) => {
            const qty = root.itemsPurchased?.[itemName] ?? 0
            return (
              <div key={itemName} className="card-plain animate-fade-in" style={{
                padding: '1rem',
                animationDelay: `${Math.min(i * 0.02, 0.3)}s`,
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: '0.6rem',
                  lineHeight: 1.3,
                }}>{itemName}</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span className={`badge ${qty > 0 ? 'badge-accent' : 'badge-muted'}`}>
                    Qty {qty}
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                    Truck inventory
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-danger"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.35rem' }}
                    onClick={() => removeItem(itemName)}
                    disabled={qty <= 0}
                  >
                    −1
                  </button>
                  <button
                    className="btn btn-success"
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.35rem' }}
                    onClick={() => addItem(itemName)}
                  >
                    +1
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
