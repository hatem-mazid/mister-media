import { projects } from '~/data/projects'

export function useProjects() {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const { getBySlug: getService } = useServices()

  const items = computed(() =>
    projects.map((project) => {
      const service = getService(project.service)

      return {
        ...project,
        name: t(`projects.items.${project.slug}`),
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

  return {
    projects: items,
    featured,
    getBySlug,
  }
}
