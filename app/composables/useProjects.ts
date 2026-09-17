import { projects } from '~/data/projects'

export function useProjects() {
  const { t, te } = useI18n()
  const localePath = useLocalePath()
  const { getBySlug: getService } = useServices()

  const items = computed(() =>
    projects.map((project) => {
      const service = getService(project.service)
      const nameKey = `projects.items.${project.slug}`

      return {
        ...project,
        name: te(nameKey) ? t(nameKey) : project.name,
        serviceName: service?.name ?? '',
        serviceIcon: service?.icon ?? 'lucide:shapes',
        serviceColor: service?.color ?? '#F18F00',
        to: localePath(`/projects/${project.slug}`),
      }
    }),
  )

  const featured = computed(() => items.value.filter(project => project.featured))

  function getBySlug(slug: string) {
    return items.value.find(project => project.slug === slug)
  }

  function neighbors(slug: string) {
    const list = items.value
    const index = list.findIndex(project => project.slug === slug)
    if (index < 0 || list.length < 2) return { previous: undefined, next: undefined }

    return {
      previous: list[(index - 1 + list.length) % list.length],
      next: list[(index + 1) % list.length],
    }
  }

  return {
    projects: items,
    featured,
    getBySlug,
    neighbors,
  }
}
