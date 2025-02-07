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

const RoomsController = () => import('#social/controllers/rooms_controller')

router.get('/rooms', [RoomsController, 'index']).use(middleware.loadRooms())
router.post('/rooms', [RoomsController, 'store']).use(middleware.auth())
router.get('/rooms/:roomId', [RoomsController, 'show']).use(middleware.loadRooms()).as('rooms.show')
router.post('/rooms/:roomId/join', [RoomsController, 'join']).use(middleware.auth())
router.post('/rooms/:roomId/quit', [RoomsController, 'quit']).use(middleware.auth())

const PostsController = () => import('#social/controllers/posts_controller')
router.get('/', [PostsController, 'feed']).use(middleware.loadRooms())

router.get('/posts', [PostsController, 'index']).use(middleware.loadRooms())
router
  .get('/create', [PostsController, 'create'])
  .as('posts.create')
  .use([middleware.auth(), middleware.loadRooms()])
router
  .post('/rooms/:roomId/posts', [PostsController, 'store'])
  .as('posts.store')
  .use(middleware.auth())
router
  .get('/rooms/:roomId/posts/:postId', [PostsController, 'show'])
  .use(middleware.loadRooms())
  .as('posts.show')
router
  .delete('/rooms/:roomId/posts/:postId', [PostsController, 'destroy'])
  .as('posts.destroy')
  .use(middleware.auth())

router
  .post('/rooms/:roomId/posts/:postId/like', [PostsController, 'like'])
  .as('posts.like')
  .use(middleware.auth())
router
  .post('/rooms/:roomId/posts/:postId/unlike', [PostsController, 'unlike'])
  .as('posts.unlike')
  .use(middleware.auth())

router
  .post('/rooms/:roomId/posts/:postId/report', [PostsController, 'report'])
  .as('posts.report')
  .use(middleware.auth())

const CommentsController = () => import('#social/controllers/comments_controller')
router
  .get('/comments', [CommentsController, 'index'])
  .as('comments.index')
  .use(middleware.loadRooms())
router
  .post('/posts/:postId/comments', [CommentsController, 'store'])
  .as('comments.store')
  .use(middleware.auth())
router
  .post('/comments/:commentId/like', [CommentsController, 'like'])
  .as('comments.like')
  .use(middleware.auth())
router
  .post('/comments/:commentId/unlike', [CommentsController, 'unlike'])
  .as('comments.unlike')
  .use(middleware.auth())
router
  .delete('/comments/:commentId', [CommentsController, 'destroy'])
  .as('comments.destroy')
  .use(middleware.auth())
router
  .post('/comments/:commentId/report', [CommentsController, 'report'])
  .as('comments.report')
  .use(middleware.auth())

const ProfilesController = () => import('#social/controllers/profiles_controller')
router
  .get('/profiles/:username', [ProfilesController, 'posts'])
  .as('profiles.posts')
  .use(middleware.loadRooms())
router
  .get('/profiles/:username/comments', [ProfilesController, 'comments'])
  .as('profiles.comments')
  .use(middleware.loadRooms())
