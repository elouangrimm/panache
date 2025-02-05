import Room from '#social/models/room'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class LoadRoomsMiddleware {
  async handle({ inertia, i18n }: HttpContext, next: NextFn) {
    const rooms = await Room.query().where('lang', i18n.locale).limit(10)

    inertia.share({
      rooms,
    })

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
