import env from '#start/env'
import { BaseMail } from '@adonisjs/mail'
// import router from '@adonisjs/core/services/router'
import User from '#common/models/user'

export default class ResetPasswordNotification extends BaseMail {
  from = env.get('EMAIL_FROM')
  subject = `Reset your password for Panache`

  constructor(private user: User) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  async prepare() {
    /**
     * Generate a signed URL with the user's email,
     * which can be used to reset the password.
     */
    // const signedUrl = router.makeSignedUrl(
    //   'auth.reset_password.show',
    //   { email: this.user.email },
    //   { expiresIn: '30m', prefixUrl: env.get('APP_URL'), purpose: 'reset_password' }
    // )

    this.message.to(this.user.email)

    this.message.html('emailHtml')
  }
}
