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

router.on('/').renderInertia('social/landing').use(middleware.loadRooms())

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
