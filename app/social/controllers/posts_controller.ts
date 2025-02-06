import WebhooksService from '#common/services/webhooks_service'
import Post from '#social/models/post'
import PostLike from '#social/models/post_like'
import Room from '#social/models/room'
import RoomMember from '#social/models/room_member'
import PostPolicy from '#social/policies/post_policy'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export default class PostsController {
  async feed({ auth, i18n, request, inertia }: HttpContext) {
    const sortMethod = request.input('method', 'popular')
    const period = request.input('period', 'day')
    const page = request.input('page', 1)
    const rooms = await Room.query().where('lang', i18n.locale).limit(10)

    const postsQuery = Post.query().whereIn(
      'room_id',
      rooms.map((room) => room.id)
    )
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
        postsQuery.where('created_at', '>=', startDate.toString())
      }
    }

    // Sort posts based on the selected method
    switch (sortMethod) {
      case 'popular':
        postsQuery.orderBy('likes_count', 'desc')
        break
      case 'new':
        postsQuery.orderBy('created_at', 'desc')
        break
    }
    postsQuery.preloadOnce('room')
    postsQuery.preload('user', (query) => {
      query.select('username')
    })
    postsQuery.paginate(page, 20)

    /**
     * Load post likes.
     */
    if (auth.isAuthenticated) {
      postsQuery.preload('likes', (query) => {
        query.where('user_id', auth.user!.id)
      })
    }

    const posts = await postsQuery

    return inertia.render('social/feed', { rooms, posts })
  }

  async show({ auth, params, response, inertia }: HttpContext) {
    const room = await Room.findBy('id', params.roomId)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    const post = await Post.query().where('id', params.postId).andWhere('room_id', room.id).first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    await post.load('user', (query) => {
      query.select('username')
    })

    /**
     * Load post likes.
     */
    if (auth.isAuthenticated) {
      await post.load('likes', (query) => {
        query.where('user_id', auth.user!.id)
      })
    }

    await post.load('comments', (query) => {
      query.whereNull('comment_id')

      query.preload('comments')
    })

    let isMember = false
    if (auth.isAuthenticated) {
      const roomMemberFound = await RoomMember.query()
        .where('room_id', room.id)
        .where('user_id', auth.user!.id)
        .first()
      isMember = roomMemberFound !== null
    }

    return inertia.render('social/post', { room, post, isMember })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('social/create')
  }

  async store({ auth, params, request, response }: HttpContext) {
    const room = await Room.findBy('id', params.roomId)
    if (room === null) {
      return response.notFound('Room not found.')
    }

    const storePostValidator = vine.compile(
      vine.object({
        title: vine.string().minLength(3).maxLength(255),
        text: vine.string().minLength(10).maxLength(1000).optional(),
        link: vine.string().url().normalizeUrl().maxLength(255).optional(),
      })
    )
    const data = await request.validateUsing(storePostValidator)

    const post = new Post()
    post.roomId = room.id
    post.userId = auth.user!.id
    post.title = data.title
    if (data.text) post.text = data.text
    if (data.link) post.link = data.link
    await post.save()

    return response.redirect().toRoute('posts.show', {
      roomId: room.id,
      postId: post.id,
    })
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    const post = await Post.query()
      .where('id', params.postId)
      .andWhere('room_id', params.roomId)
      .first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    if (await bouncer.with(PostPolicy).denies('delete', post)) {
      return response.forbidden('Cannot delete this post.')
    }

    await post.delete()

    return response.redirect().toRoute('rooms.show', { roomId: params.roomId })
  }

  async like({ auth, params, response }: HttpContext) {
    const post = await Post.query()
      .where('id', params.postId)
      .andWhere('room_id', params.roomId)
      .first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    await PostLike.firstOrCreate({
      userId: auth.user!.id,
      postId: post.id,
    })

    return response.redirect().back()
  }

  async unlike({ auth, params, response }: HttpContext) {
    const post = await Post.query()
      .where('id', params.postId)
      .andWhere('room_id', params.roomId)
      .first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    const postLike = await PostLike.query()
      .where('user_id', auth.user!.id)
      .andWhere('post_id', post.id)
      .first()
    if (postLike === null) {
      return response.notFound('Like not found.')
    }

    await postLike.delete()

    return response.redirect().back()
  }

  @inject()
  async report({ auth, params, request, response }: HttpContext, webhooksService: WebhooksService) {
    const post = await Post.query()
      .where('id', params.postId)
      .andWhere('room_id', params.roomId)
      .first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

    await webhooksService.send(
      `[!] [Post Report] [User ${auth.user!.id}] [Post ${params.postId}] [Description ${request.input('description')}]`
    )

    return response.ok('Post reported!')
  }
}
