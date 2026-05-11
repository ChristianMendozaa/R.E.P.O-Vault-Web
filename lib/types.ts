export interface SaveData {
  teamName: { value: string }
  playerNames: { value: Record<string, string> }
  dictionaryOfDictionaries: { value: RootData }
}

export interface RootData {
  runStats: RunStats
  itemsPurchased: Record<string, number>
  itemStatBattery: Record<string, number>
  item: Record<string, number>
  playerHealth: Record<string, number>
  playerUpgradeHealth: Record<string, number>
  playerUpgradeStamina: Record<string, number>
  playerUpgradeExtraJump: Record<string, number>
  playerUpgradeLaunch: Record<string, number>
  playerUpgradeMapPlayerCount: Record<string, number>
  playerUpgradeSpeed: Record<string, number>
  playerUpgradeStrength: Record<string, number>
  playerUpgradeRange: Record<string, number>
  playerUpgradeThrow: Record<string, number>
  playerUpgradeCrouchRest: Record<string, number>
  playerUpgradeTumbleClimb: Record<string, number>
  playerUpgradeTumbleWings: Record<string, number>
  playerUpgradeDeathHeadBattery: Record<string, number>
}

export interface RunStats {
  level: number
  currency: number
  'save level': number
  lives?: number
}

export interface Player {
  id: string
  name: string
  health: number
}

export type ViewName = 'dashboard' | 'overview' | 'players' | 'items' | 'truck'

export const PLAYER_FIELD_METADATA: Array<{
  label: string
  suffix: string
  jsonKey: keyof RootData
  capText: string | null
  capColor: string | null
  description: string | null
}> = [
  { label: 'Health', suffix: 'health', jsonKey: 'playerHealth', capText: null, capColor: null, description: 'Current player HP. Recommended max: 200.' },
  { label: 'Health Upgrade', suffix: 'health_upgrade', jsonKey: 'playerUpgradeHealth', capText: '+20 HP each', capColor: 'success', description: null },
  { label: 'Stamina', suffix: 'stamina_upgrade', jsonKey: 'playerUpgradeStamina', capText: '+10 SP each', capColor: 'success', description: null },
  { label: 'Extra Jump', suffix: 'extra_jump_upgrade', jsonKey: 'playerUpgradeExtraJump', capText: null, capColor: null, description: null },
  { label: 'Launch', suffix: 'launch_upgrade', jsonKey: 'playerUpgradeLaunch', capText: '~10 recommended', capColor: 'success', description: null },
  { label: 'Map Player Count', suffix: 'mapplayercount_upgrade', jsonKey: 'playerUpgradeMapPlayerCount', capText: 'MAX 1', capColor: 'danger', description: null },
  { label: 'Speed', suffix: 'speed_upgrade', jsonKey: 'playerUpgradeSpeed', capText: 'Caution 4+', capColor: 'accent', description: null },
  { label: 'Strength', suffix: 'strength_upgrade', jsonKey: 'playerUpgradeStrength', capText: '~13 recommended', capColor: 'success', description: null },
  { label: 'Range', suffix: 'range_upgrade', jsonKey: 'playerUpgradeRange', capText: '~10 recommended', capColor: 'success', description: null },
  { label: 'Throw', suffix: 'throw_upgrade', jsonKey: 'playerUpgradeThrow', capText: 'No hard cap', capColor: null, description: null },
  { label: 'Crouch Rest', suffix: 'crouchrest_upgrade', jsonKey: 'playerUpgradeCrouchRest', capText: 'No hard cap', capColor: null, description: null },
  { label: 'Tumble Climb', suffix: 'tumbleclimb_upgrade', jsonKey: 'playerUpgradeTumbleClimb', capText: 'No hard cap', capColor: null, description: null },
  { label: 'Tumble Wings', suffix: 'tumblewings_upgrade', jsonKey: 'playerUpgradeTumbleWings', capText: 'No hard cap', capColor: null, description: null },
  { label: 'Death Head Battery', suffix: 'deathheadbattery_upgrade', jsonKey: 'playerUpgradeDeathHeadBattery', capText: 'No hard cap', capColor: null, description: null },
]
