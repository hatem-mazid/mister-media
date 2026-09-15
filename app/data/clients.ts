import logo399 from '~/assets/images/client-logos/logoipsum-399 1.svg?url'
import logo407 from '~/assets/images/client-logos/logoipsum-407 1.svg?url'
import logo413 from '~/assets/images/client-logos/logoipsum-413 1.svg?url'
import logo420 from '~/assets/images/client-logos/logoipsum-420 2.svg?url'
import logo427 from '~/assets/images/client-logos/logoipsum-427 1.svg?url'
import logo431 from '~/assets/images/client-logos/logoipsum-431 1.svg?url'
import logo433 from '~/assets/images/client-logos/logoipsum-433 1.svg?url'

export const clients = [
  { slug: 'logoipsum-399', src: logo399, width: 52, height: 52 },
  { slug: 'logoipsum-407', src: logo407, width: 64, height: 52 },
  { slug: 'logoipsum-413', src: logo413, width: 80, height: 52 },
  { slug: 'logoipsum-420', src: logo420, width: 168, height: 52 },
  { slug: 'logoipsum-427', src: logo427, width: 52, height: 52 },
  { slug: 'logoipsum-431', src: logo431, width: 72, height: 52 },
  { slug: 'logoipsum-433', src: logo433, width: 52, height: 52 },
] as const

export type ClientRecord = (typeof clients)[number]
