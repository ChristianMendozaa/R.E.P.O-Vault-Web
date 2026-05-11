import { RootData } from './types'
import { STATIC_ITEM_IDS } from '@/constants/items'

export function buildTypeIdMap(rootData: RootData): Record<string, number> {
  const map: Record<string, number> = { ...STATIC_ITEM_IDS }
  for (const [key, value] of Object.entries(rootData.item ?? {})) {
    if (!key.includes('/')) continue
    const baseName = key.substring(0, key.lastIndexOf('/'))
    if (!(baseName in map)) map[baseName] = value
  }
  return map
}

function ensureContainers(rootData: RootData) {
  if (!rootData.itemsPurchased) rootData.itemsPurchased = {}
  if (!rootData.itemStatBattery) rootData.itemStatBattery = {}
  if (!rootData.item) rootData.item = {}
}

function nextItemIndex(rootData: RootData, baseName: string): number {
  const existing = Object.keys(rootData.itemStatBattery ?? {})
    .filter(k => k.startsWith(baseName + '/'))
    .map(k => parseInt(k.substring(k.lastIndexOf('/') + 1)))
    .filter(n => !isNaN(n))
  return existing.length > 0 ? Math.max(...existing) + 1 : 1
}

export function forceShopState(rootData: RootData) {
  rootData.runStats['save level'] = 1
}

export function addItem(rootData: RootData, itemName: string, batteryValue = 100): number {
  ensureContainers(rootData)
  const typeIdMap = buildTypeIdMap(rootData)
  const typeId = typeIdMap[itemName] ?? 0
  const newKey = `${itemName}/${nextItemIndex(rootData, itemName)}`
  rootData.itemStatBattery[newKey] = batteryValue
  rootData.item[newKey] = typeId
  if (!(itemName in rootData.item)) rootData.item[itemName] = 0
  rootData.itemsPurchased[itemName] = (rootData.itemsPurchased[itemName] ?? 0) + 1
  forceShopState(rootData)
  return rootData.itemsPurchased[itemName]
}

export function removeItem(rootData: RootData, itemName: string): number {
  ensureContainers(rootData)
  const current = rootData.itemsPurchased[itemName] ?? 0
  if (current <= 0) return 0

  const indices = Object.keys(rootData.itemStatBattery)
    .filter(k => k.startsWith(itemName + '/'))
    .map(k => parseInt(k.substring(k.lastIndexOf('/') + 1)))
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b)

  if (indices.length > 0) {
    const removeKey = `${itemName}/${indices[indices.length - 1]}`
    delete rootData.itemStatBattery[removeKey]
    delete rootData.item[removeKey]
  }

  const newQty = Math.max(0, current - 1)
  if (newQty === 0) {
    delete rootData.itemsPurchased[itemName]
  } else {
    rootData.itemsPurchased[itemName] = newQty
  }
  forceShopState(rootData)
  return newQty
}

export function applyHaveEverything(rootData: RootData): number {
  ensureContainers(rootData)
  const typeIdMap = buildTypeIdMap(rootData)
  let count = 0
  for (const itemName of Object.keys(typeIdMap).sort()) {
    if ((rootData.itemsPurchased[itemName] ?? 0) !== 0) continue
    const typeId = typeIdMap[itemName] ?? 0
    const newKey = `${itemName}/${nextItemIndex(rootData, itemName)}`
    rootData.itemStatBattery[newKey] = 100
    rootData.item[newKey] = typeId
    if (!(itemName in rootData.item)) rootData.item[itemName] = 0
    rootData.itemsPurchased[itemName] = 1
    count++
  }
  forceShopState(rootData)
  return count
}

export function calculateItemTotals(rootData: RootData): { total: number; unique: number } {
  const purchased = rootData.itemsPurchased ?? {}
  const total = Object.values(purchased).reduce((s, v) => s + v, 0)
  const unique = Object.values(purchased).filter(v => v > 0).length
  return { total, unique }
}
