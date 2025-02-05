import Post from '#social/models/post'
import PostLike from '#social/models/post_like'
import Room from '#social/models/room'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class PostsController {
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
      post.load('likes', (query) => {
        query.where('user_id', auth.user!.id)
      })
    }

    return inertia.render('social/posts/show', { room, post })
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

  async destroy({ params, response }: HttpContext) {
    const post = await Post.query()
      .where('id', params.postId)
      .andWhere('room_id', params.roomId)
      .first()
    if (post === null) {
      return response.notFound('Post not found.')
    }

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
}
