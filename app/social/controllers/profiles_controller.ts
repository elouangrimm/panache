import Profile from '#social/models/profile'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import vine from '@vinejs/vine'

export default class ProfilesController {
  async posts({ auth, params, inertia, response }: HttpContext) {
    const profile = await Profile.query()
      .where('username', params.username)
      .select('id', 'username', 'avatar')
      .preload('posts', (query) => {
        query.orderBy('created_at', 'desc')
        query.preload('room')

        /**
         * Load post likes.
         */
        if (auth.isAuthenticated) {
          query.preload('likes', (query) => {
            query.where('profile_id', auth.user!.currentProfileId!)
          })
        }
      })
      .first()
    if (profile === null) {
      return response.notFound('Profile not found.')
    }

    return inertia.render('social/profile_posts', { profile })
  }

  async comments({ auth, params, inertia, response }: HttpContext) {
    const profile = await Profile.query()
      .where('username', params.username)
      .select('id', 'username', 'avatar')
      .preload('comments', (query) => {
        query.preload('post', (query) => {
          query.preload('room')
        })
        query.orderBy('created_at', 'desc')

        /**
         * Load post likes.
         */
        if (auth.isAuthenticated) {
          query.preload('likes', (query) => {
            query.where('profile_id', auth.user!.currentProfileId!)
          })
        }
      })
      .first()
    if (profile === null) {
      return response.notFound('Profile not found.')
    }

    return inertia.render('social/profile_comments', { profile })
  }

  async updateUsername({ auth, params, request, response }: HttpContext) {
    const updateUsernameValidator = vine.compile(
      vine.object({
        username: vine
          .string()
          .minLength(3)
          .maxLength(255)
          .trim()
          .regex(/^[a-zA-Z0-9._%+-]+$/)
          .toLowerCase()
          .unique(async (db, value) => {
            const profileFoundByUsername = await db
              .from('profiles')
              .where('username', value)
              .first()
            return !profileFoundByUsername
          }),
      })
    )
    const data = await request.validateUsing(updateUsernameValidator)

    await auth.user!.loadOnce('currentProfile')

    const { currentProfile } = auth.user!

    if (!currentProfile) {
      return response.notFound('Profile not found.')
    }

    if (currentProfile.username !== params.username) {
      return response.forbidden('You are not allowed to update this profile.')
    }

    currentProfile.username = data.username
    await currentProfile.save()

    return response.redirect().toPath(`/profiles/${data.username}`)
  }

  async updateAvatar({ auth, params, request, response }: HttpContext) {
    const updateAvatarValidator = vine.compile(
      vine.object({
        avatar: vine.file({
          size: '100kb',
          extnames: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
        }),
      })
    )
    const data = await request.validateUsing(updateAvatarValidator)

    const { currentProfile } = auth.user!

    if (!currentProfile) {
      return response.notFound('Profile not found.')
    }

    if (currentProfile.username !== params.username) {
      return response.forbidden('You are not allowed to update this profile.')
    }

    const key = `uploads/${cuid()}.${data.avatar.extname}`
    await data.avatar.moveToDisk(key, 's3', {
      visibility: 'public',
    })
    currentProfile.avatar = await drive.use().getUrl(key)
    await currentProfile.save()

    return response.redirect().toPath(`/profiles/${params.username}`)
  }
}
