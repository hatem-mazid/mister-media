// ISO3 codes matching app/data/worldMap.ts. Names live in i18n under `coverage.countries.*`.

export const headquarters = 'TUR'

// Placeholder markets until the client confirms the countries served (PROJECT.md §6).
export const markets = [
  'SAU',
  'ARE',
  'QAT',
  'KWT',
  'IRQ',
  'SYR',
  'JOR',
  'EGY',
  'LBY',
  'DEU',
  'GBR',
  'USA',
  'MYS',
] as const

export type MarketCode = typeof markets[number]
