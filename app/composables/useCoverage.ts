import { headquarters, markets } from '~/data/coverage'
import { countryCentroids, countryDots } from '~/data/worldMap'

export interface CoveragePlace {
  code: string
  name: string
  point: readonly [number, number]
  dots: string
}

function place(code: string, name: string): CoveragePlace {
  return {
    code,
    name,
    point: countryCentroids[code] ?? [0, 0],
    dots: countryDots[code] ?? '',
  }
}

export function useCoverage() {
  const { t } = useI18n()

  const hq = computed(() => place(headquarters, t(`coverage.countries.${headquarters}`)))

  const items = computed(() =>
    markets.map(code => place(code, t(`coverage.countries.${code}`))),
  )

  // Every dot that is neither HQ nor a market, drawn once as the muted base layer.
  const baseDots = computed(() => {
    const highlighted = new Set<string>([headquarters, ...markets])
    return Object.entries(countryDots)
      .filter(([code]) => !highlighted.has(code))
      .map(([, d]) => d)
      .join('')
  })

  return {
    hq,
    markets: items,
    baseDots,
  }
}
