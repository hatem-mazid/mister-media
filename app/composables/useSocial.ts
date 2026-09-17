const networks = [
  { key: 'instagram', icon: 'simple-icons:instagram', configKey: 'instagramUrl' },
  { key: 'behance', icon: 'simple-icons:behance', configKey: 'behanceUrl' },
  { key: 'facebook', icon: 'simple-icons:facebook', configKey: 'facebookUrl' },
  { key: 'youtube', icon: 'simple-icons:youtube', configKey: 'youtubeUrl' },
] as const

export function useSocial() {
  const config = useRuntimeConfig()
  const { t } = useI18n()

  const links = computed(() =>
    networks.map((network) => ({
      key: network.key,
      icon: network.icon,
      label: t(`footer.social.${network.key}`),
      href: String(config.public[network.configKey] || '#'),
    })),
  )

  return { links }
}
