import Room from '#social/models/room'
import RoomMember from '#social/models/room_member'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class RoomsController {
  async store({ i18n, request, response }: HttpContext) {
    const storeRoomValidator = vine.compile(
      vine.object({
        name: vine.string().minLength(3),
        description: vine.string().minLength(10),
      })
    )

    const data = await request.validateUsing(storeRoomValidator)

    const room = new Room()
    room.name = data.name
    room.description = data.description
    room.lang = i18n.locale
    await room.save()

    return response.redirect().toRoute('rooms.show', { roomId: room.id })
  }

  async show({ auth, params, inertia, request, response }: HttpContext) {
    const sortMethod = request.input('method', 'popular')
    const period = request.input('period', 'day')

    const room = await Room.findBy('id', params.roomId)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    await room.load('posts', (query) => {
      // Filter posts by the selected period
      if (sortMethod === 'popular') {
        let startDate: DateTime | null = null

        switch (period) {
          case 'day':
            startDate = DateTime.now().minus({ days: 1 })
            break
          case 'week':
            startDate = DateTime.now().minus({ weeks: 1 })
            break
          case 'month':
            startDate = DateTime.now().minus({ months: 1 })
            break
          case 'all':
            startDate = null
            break
        }

        if (startDate) {
          query.where('created_at', '>=', startDate.toString())
        }
      }

      // Sort posts based on the selected method
      switch (sortMethod) {
        case 'popular':
          query.orderBy('likes_count', 'desc')
          break
        case 'new':
          query.orderBy('created_at', 'desc')
          break
      }

      /**
       * Load post likes.
       */
      if (auth.isAuthenticated) {
        query.preload('likes', (query) => {
          query.where('user_id', auth.user!.id)
        })
      }

      /**
       * Load the post author.
       */
      query.preload('user', (query) => {
        query.select('username')
      })
    })

    if (!auth.isAuthenticated) {
      return inertia.render('social/rooms/show', { room, posts: room.posts })
    }

    const roomMemberFound = await RoomMember.query()
      .where('room_id', room.id)
      .where('user_id', auth.user!.id)
      .first()
    const isMember = roomMemberFound !== null

    return inertia.render('social/rooms/show', { room, posts: room.posts, isMember })
  }

  async join({ auth, params, response }: HttpContext) {
    const room = await Room.findBy('id', params.roomId)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    await RoomMember.firstOrCreate({
      roomId: room.id,
      userId: auth.user!.id,
    })

    return response.redirect().withQs().back()
  }

  async quit({ auth, params, response }: HttpContext) {
    const room = await Room.findBy('id', params.roomId)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    const roomMember = await RoomMember.query()
      .where('room_id', room.id)
      .where('user_id', auth.user!.id)
      .first()
    if (roomMember === null) {
      return response.redirect().back()
    }

    await roomMember.delete()

    return response.redirect().withQs().back()
  }
}
