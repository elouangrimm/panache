import User from '#common/models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async show({ auth, params, inertia, response }: HttpContext) {
    const profile = await User.query()
      .where('username', params.username)
      .select('id', 'username')
      .preload('posts', (query) => {
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
      .preload('comments', (query) => {
        query.preload('post')

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

    return inertia.render('social/profile', { profile })
  }
}
