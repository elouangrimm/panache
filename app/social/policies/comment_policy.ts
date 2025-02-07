import User from '#common/models/user'
import Comment from '#social/models/comment'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CommentPolicy extends BasePolicy {
  /**
   * Only the comment creator can delete the comment
   */
  delete(user: User, comment: Comment): AuthorizerResponse {
    if (user.role === 'admin') {
      return true
    }
    return user.id === comment.userId
  }
}
