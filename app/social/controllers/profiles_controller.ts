import User from '#common/models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async show({ params, inertia, response }: HttpContext) {
    const profile = await User.query()
      .where('username', params.username)
      .select('id', 'username')
      .preload('posts', (query) => {
        query.preload('room')
      })
      .preload('comments', (query) => {
        query.preload('post')
      })
      .first()
    if (profile === null) {
      return response.notFound('Profile not found.')
    }

    return inertia.render('social/profile', { profile })
  }
}
