import User from '#common/models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async posts({ auth, params, inertia, response }: HttpContext) {
    const profile = await User.query()
      .where('username', params.username)
      .select('id', 'username')
      .preload('posts', (query) => {
        query.orderBy('created_at', 'desc')
        query.preload('room')

        /**
         * Load post likes.
         */
        if (auth.isAuthenticated) {
          query.preload('likes', (query) => {
            query.where('user_id', auth.user!.id)
          })
        }
      })
      .first()
    if (profile === null) {
      return response.notFound('Profile not found.')
    }

    return inertia.render('social/profile_posts', { profile })
  }

  async comments({ auth, params, inertia, response }: HttpContext) {
    const profile = await User.query()
      .where('username', params.username)
      .select('id', 'username')
      .preload('comments', (query) => {
        query.preload('post', (query) => {
          query.preload('room')
        })
        query.orderBy('created_at', 'desc')

        /**
         * Load post likes.
         */
        if (auth.isAuthenticated) {
          query.preload('likes', (query) => {
            query.where('user_id', auth.user!.id)
          })
        }
      })
      .first()
    if (profile === null) {
      return response.notFound('Profile not found.')
    }

    return inertia.render('social/profile_comments', { profile })
  }
}
