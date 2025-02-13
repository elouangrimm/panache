import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  async handle({ auth }: HttpContext, next: NextFn) {
    await auth.check()

    if (auth.isAuthenticated) {
      await auth.user?.load('currentProfile')
    }

    return next()
  }
}
