import User from '#common/models/user'
import PostComment from '#social/models/post_comment'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CommentPolicy extends BasePolicy {
  /**
   * Only the comment creator can delete the comment
   */
  delete(user: User, comment: PostComment): AuthorizerResponse {
    if (user.role === 'admin') {
      return true
    }
    return user.id === comment.userId
  }
}
