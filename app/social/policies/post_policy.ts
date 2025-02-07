import User from '#common/models/user'
import Post from '#social/models/post'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class PostPolicy extends BasePolicy {
  /**
   * Only the post creator can delete the post
   */
  delete(user: User, post: Post): AuthorizerResponse {
    if (user.role === 'admin') {
      return true
    }
    return user.currentProfileId === post.profileId
  }
}
