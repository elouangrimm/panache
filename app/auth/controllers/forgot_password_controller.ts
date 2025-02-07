import User from '#common/models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import mail from '@adonisjs/mail/services/main'
import ResetPasswordNotification from '#auth/notifications/reset_password_notification'

export default class ForgotPasswordController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/forgot_password')
  }

  async handle({ request, response }: HttpContext) {
    /**
     * Validate the email input.
     */
    const forgotPasswordValidator = vine.compile(
      vine.object({
        email: vine.string().email().trim().normalizeEmail(),
      })
    )
    const validatedData = await request.validateUsing(forgotPasswordValidator)

    /**
     * Check if the user exists, if not,
     * flash a success message to prevent user enumeration.
     */
    const user = await User.findBy('email', validatedData.email)
    if (!user) {
      return response.redirect().back()
    }

    /**
     * Send an email with the signed URL.
     */
    await mail.sendLater(new ResetPasswordNotification(user))

    return response.redirect().back()
  }
}
