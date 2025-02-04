import User from '#common/models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

export default class SignUpController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/sign_up')
  }

  async handle({ auth, request, response, session }: HttpContext) {
    const signUpValidator = vine.compile(
      vine.object({
        firstName: vine.string().trim().minLength(1).maxLength(255),
        lastName: vine.string().trim().minLength(1).maxLength(255),
        username: vine
          .string()
          .minLength(3)
          .maxLength(255)
          .trim()
          .regex(/^[a-zA-Z0-9._%+-]+$/)
          .toLowerCase(),
        backupEmail: vine.string().email().trim().normalizeEmail().optional(),
        password: vine.string().minLength(8),
      })
    )

    const payload = await request.validateUsing(signUpValidator)

    const userAlreadyExists = await User.findBy('username', payload.username)
    if (userAlreadyExists !== null) {
      session.flash('errors.email', 'Email already exists')
      return response.redirect().back()
    }

    const user = await User.create(payload)
    await user.save()

    await auth.use('web').login(user)

    return response.redirect('/')
  }
}
