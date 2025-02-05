/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import Room from '#social/models/room'
import { DateTime } from 'luxon'
import Post from '#social/models/post'

const SignUpController = () => import('#auth/controllers/sign_up_controller')
router.get('/auth/sign_up', [SignUpController, 'show'])
router.post('/auth/sign_up', [SignUpController, 'handle'])

const SignInController = () => import('#auth/controllers/sign_in_controller')
router.get('/auth/sign_in', [SignInController, 'show'])
router.post('/auth/sign_in', [SignInController, 'handle'])

const SignOutController = () => import('#auth/controllers/sign_out_controller')
router.post('/auth/sign_out', [SignOutController, 'handle'])

const ForgotPasswordController = () => import('#auth/controllers/forgot_password_controller')
router.get('/auth/forgot_password', [ForgotPasswordController, 'show'])
router.post('/auth/forgot_password', [ForgotPasswordController, 'handle'])

router
  .get('/', async ({ i18n, request, inertia }) => {
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
    postsQuery.preload('user', (query) => {
      query.select('username')
    })
    postsQuery.paginate(page, 20)

    const posts = await postsQuery

    return inertia.render('social/landing', { rooms, posts })
  })
  .use(middleware.loadRooms())

const RoomsController = () => import('#social/controllers/rooms_controller')
router
  .group(() => {
    router.post('/rooms', [RoomsController, 'store'])
    router
      .get('/rooms/:roomId', [RoomsController, 'show'])
      .use(middleware.loadRooms())
      .as('rooms.show')
    router.post('/rooms/:roomId/join', [RoomsController, 'join'])
    router.post('/rooms/:roomId/quit', [RoomsController, 'quit'])
  })
  .use(middleware.auth())

const PostsController = () => import('#social/controllers/posts_controller')
router
  .group(() => {
    router
      .get('/create', [PostsController, 'create'])
      .as('posts.create')
      .use(middleware.loadRooms())
    router.post('/rooms/:roomId/posts', [PostsController, 'store']).as('posts.store')
    router
      .get('/rooms/:roomId/posts/:postId', [PostsController, 'show'])
      .use(middleware.loadRooms())
      .as('posts.show')
    router.delete('/rooms/:roomId/posts/:postId', [PostsController, 'destroy']).as('posts.destroy')

    router.post('/rooms/:roomId/posts/:postId/like', [PostsController, 'like']).as('posts.like')
    router
      .post('/rooms/:roomId/posts/:postId/unlike', [PostsController, 'unlike'])
      .as('posts.unlike')
  })
  .use(middleware.auth())
