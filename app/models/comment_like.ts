import { BaseModel, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#common/models/user'
import db from '@adonisjs/lucid/services/db'
import PostComment from '#social/models/post_comment'

export default class CommentLike extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => PostComment)
  declare comment: BelongsTo<typeof PostComment>

  @column()
  declare commentId: string

  @beforeCreate()
  static async incrementLikesCount(comment: PostComment) {
    await db.from('post_comments').where('id', comment.postId).increment('likes_count', 1)
  }

  @beforeDelete()
  static async decrementLikesCount(comment: PostComment) {
    await db.from('post_comments').where('id', comment.postId).increment('likes_count', -1)
  }
}
