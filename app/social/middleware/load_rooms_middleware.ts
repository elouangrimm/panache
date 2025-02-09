import Room from '#social/models/room'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class LoadRoomsMiddleware {
  async handle({ auth, inertia }: HttpContext, next: NextFn) {
    const popularRooms = await Room.query().orderBy('members_count').limit(10)
    inertia.share({ popularRooms })

    if (auth.isAuthenticated) {
      /**
       * Retrieve current profile for the authenticated user
       */
      await auth.user!.loadOnce('currentProfile')
      const { currentProfile } = auth.user!

      /**
       * Retrieve rooms that the user is a member of
       * and share them with the frontend
       */
      const joinedRooms = await Room.query()
        .whereHas('members', (builder) => {
          builder.where('profile_id', currentProfile.id)
        })
        .orderBy('created_at', 'desc')
        .limit(10)
      inertia.share({ joinedRooms })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
