'use client'

import { create } from 'zustand'
import { SaveData, RootData, RunStats, Player, ViewName, PLAYER_FIELD_METADATA } from './types'
import { addItem, removeItem, applyHaveEverything, calculateItemTotals } from './inventory-logic'

interface EditorStore {
  jsonData: SaveData | null
  fileName: string
  isDirty: boolean
  currentView: ViewName
  statusMessage: string
  statusTone: 'info' | 'success' | 'warning' | 'danger'

  // File ops
  loadSave: (data: SaveData, fileName: string) => void
  markSaved: () => void

  // Navigation
  setCurrentView: (view: ViewName) => void

  // Status
  setStatus: (message: string, tone?: 'info' | 'success' | 'warning' | 'danger') => void

  // Run stats
  updateRunStat: (key: string, value: number) => void
  setSaveLevel: (level: 0 | 1) => void

  // Players
  updatePlayerField: (playerId: string, jsonKey: keyof RootData, value: number) => void
  applyToAllPlayers: (fields: Record<string, string>) => void

  // Items
  addItem: (itemName: string) => void
  removeItem: (itemName: string) => void
  haveEverything: () => void

  // Selectors
  getRootData: () => RootData
  getRunStats: () => RunStats
  getPlayers: () => Player[]
  getSaveStateLabel: () => string
  getItemTotals: () => { total: number; unique: number }
}

function markDirty(set: (fn: (s: EditorStore) => Partial<EditorStore>) => void) {
  set(() => ({ isDirty: true }))
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  jsonData: null,
  fileName: '',
  isDirty: false,
  currentView: 'dashboard',
  statusMessage: '',
  statusTone: 'info',

  loadSave: (data, fileName) =>
    set({ jsonData: data, fileName, isDirty: false, currentView: 'dashboard', statusMessage: 'File loaded', statusTone: 'success' }),

  markSaved: () => set({ isDirty: false, statusMessage: 'Saved successfully', statusTone: 'success' }),

  setCurrentView: (view) => set({ currentView: view }),

  setStatus: (message, tone = 'info') => set({ statusMessage: message, statusTone: tone }),

  updateRunStat: (key, value) => {
    set(s => {
      if (!s.jsonData) return {}
      const next = structuredClone(s.jsonData)
      ;(next.dictionaryOfDictionaries.value.runStats as unknown as Record<string, number>)[key] = value
      return { jsonData: next, isDirty: true }
    })
  },

  setSaveLevel: (level) => {
    set(s => {
      if (!s.jsonData) return {}
      const next = structuredClone(s.jsonData)
      next.dictionaryOfDictionaries.value.runStats['save level'] = level
      return { jsonData: next, isDirty: true }
    })
  },

  updatePlayerField: (playerId, jsonKey, value) => {
    set(s => {
      if (!s.jsonData) return {}
      const next = structuredClone(s.jsonData)
      const dict = next.dictionaryOfDictionaries.value[jsonKey] as Record<string, number>
      if (!dict) next.dictionaryOfDictionaries.value[jsonKey] = {} as never
      ;(next.dictionaryOfDictionaries.value[jsonKey] as Record<string, number>)[playerId] = value
      return { jsonData: next, isDirty: true }
    })
  },

  applyToAllPlayers: (fields) => {
    set(s => {
      if (!s.jsonData) return {}
      const next = structuredClone(s.jsonData)
      const root = next.dictionaryOfDictionaries.value
      const playerIds = Object.keys(next.playerNames.value)
      let changed = false
      for (const { suffix, jsonKey } of PLAYER_FIELD_METADATA) {
        const raw = fields[suffix]?.trim()
        if (!raw) continue
        const val = parseInt(raw)
        if (isNaN(val)) continue
        if (!root[jsonKey]) root[jsonKey] = {} as never
        for (const id of playerIds) {
          ;(root[jsonKey] as Record<string, number>)[id] = val
        }
        changed = true
      }
      return changed ? { jsonData: next, isDirty: true } : {}
    })
  },

  addItem: (itemName) => {
    set(s => {
      if (!s.jsonData) return {}
      const next = structuredClone(s.jsonData)
      addItem(next.dictionaryOfDictionaries.value, itemName)
      return { jsonData: next, isDirty: true }
    })
  },

  removeItem: (itemName) => {
    set(s => {
      if (!s.jsonData) return {}
      const next = structuredClone(s.jsonData)
      removeItem(next.dictionaryOfDictionaries.value, itemName)
      return { jsonData: next, isDirty: true }
    })
  },

  haveEverything: () => {
    set(s => {
      if (!s.jsonData) return {}
      const next = structuredClone(s.jsonData)
      applyHaveEverything(next.dictionaryOfDictionaries.value)
      return { jsonData: next, isDirty: true }
    })
  },

  getRootData: () => get().jsonData!.dictionaryOfDictionaries.value,

  getRunStats: () => get().jsonData!.dictionaryOfDictionaries.value.runStats,

  getPlayers: () => {
    const { jsonData } = get()
    if (!jsonData) return []
    const root = jsonData.dictionaryOfDictionaries.value
    return Object.entries(jsonData.playerNames.value).map(([id, name]) => ({
      id,
      name,
      health: root.playerHealth?.[id] ?? 100,
    }))
  },

  getSaveStateLabel: () => {
    const stats = get().jsonData?.dictionaryOfDictionaries.value.runStats
    return stats?.['save level'] === 1 ? 'Shop' : 'In-Game / Truck'
  },

  getItemTotals: () => {
    const { jsonData } = get()
    if (!jsonData) return { total: 0, unique: 0 }
    return calculateItemTotals(jsonData.dictionaryOfDictionaries.value)
  },
}))
