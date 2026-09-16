import { testimonials } from '~/data/testimonials'

export function useTestimonials() {
  const { t, te, locale } = useI18n()

  const items = computed(() => {
    const list = new Intl.ListFormat(locale.value, { type: 'unit', style: 'short' })

    return testimonials.map((item) => {
      const positionKey = `testimonials.items.${item.slug}.position`
      const companyKey = `testimonials.items.${item.slug}.company`
      const position = te(positionKey) ? t(positionKey) : ''
      const company = te(companyKey) ? t(companyKey) : ''
      const roleParts = [position, company].filter(Boolean)

      return {
        ...item,
        quote: t(`testimonials.items.${item.slug}.quote`),
        name: t(`testimonials.items.${item.slug}.name`),
        position,
        company,
        role: roleParts.length ? list.format(roleParts) : '',
      }
    })
  })

  return {
    testimonials: items,
  }
}
