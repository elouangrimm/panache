import PostCreated from '#social/events/post_created'
import emitter from '@adonisjs/core/services/emitter'

const CacheOgImage = () => import('#social/listeners/cache_og_image')

emitter.on(PostCreated, [CacheOgImage])
