import Room from '#social/models/room'
import RoomMember from '#social/models/room_member'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import string from '@adonisjs/core/helpers/string'
import { inject } from '@adonisjs/core'
import WebhooksService from '#common/services/webhooks_service'

export default class RoomsController {
  async index({ inertia, request }: HttpContext) {
    const searchQuery = request.input('search')
    const page = parseInt(request.input('page', 1))

    const result = await Room.query()
      .if(searchQuery, (query) => {
        query.whereRaw(
          `unaccent(LOWER(name)) LIKE unaccent(?) OR unaccent(LOWER(description)) LIKE unaccent(?)`,
          [`%${searchQuery}%`, `%${searchQuery}%`]
        )
      })
      .paginate(page, 20)

    return inertia.render('social/rooms', { roomsList: result.all() })
  }

  @inject()
  async store({ auth, i18n, request, response }: HttpContext, webhooksService: WebhooksService) {
    const storeRoomValidator = vine.compile(
      vine.object({
        name: vine
          .string()
          .minLength(3)
          .unique(async (db, value) => {
            const roomFoundByName = await db
              .from('rooms')
              .where('name', value)
              .orWhere(
                'id',
                string.slug(value, { lower: true, replacement: '-', locale: i18n.locale })
              )
              .first()
            return !roomFoundByName
          }),
        description: vine.string().minLength(10),
      })
    )

    const data = await request.validateUsing(storeRoomValidator)

    const room = new Room()
    room.name = data.name
    room.description = data.description
    room.lang = i18n.locale
    await room.save()

    await room.related('members').create({
      profileId: auth.user!.currentProfileId!,
      roomId: room.id,
      role: 'moderator',
    })

    await webhooksService.send(`[+] [New Room created with name: ${room.name}]`)

    return response.redirect().toRoute('rooms.show', [room.id])
  }

  async show({ auth, params, inertia, request, response }: HttpContext) {
    const sortMethod = request.input('method', 'popular')
    const period = request.input('period', 'day')

    const room = await Room.findBy('id', params.roomId)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    await room.load('posts', (query) => {
      query.limit(50)

      query.preloadOnce('room')

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
          query.where('profile_id', auth.user!.currentProfileId!)
        })
      }

      /**
       * Load the post author.
       */
      query.preload('profile', (query) => {
        query.select('username', 'avatar')
      })
    })

    if (!auth.isAuthenticated) {
      return inertia.render('social/room', { room, posts: room.posts })
    }

    const roomMemberFound = await RoomMember.query()
      .where('room_id', room.id)
      .where('profile_id', auth.user!.currentProfileId!)
      .first()
    const isMember = roomMemberFound !== null

    return inertia.render('social/room', { room, posts: room.posts, isMember })
  }

  async join({ auth, params, response }: HttpContext) {
    const room = await Room.findBy('id', params.roomId)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    await RoomMember.firstOrCreate({
      roomId: room.id,
      profileId: auth.user!.currentProfileId!,
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
      .where('profile_id', auth.user!.currentProfileId!)
      .first()
    if (roomMember === null) {
      return response.redirect().back()
    }

    await roomMember.delete()

    return response.redirect().withQs().back()
  }
}
