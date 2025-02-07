import { BaseModel, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#common/models/user'
import db from '@adonisjs/lucid/services/db'
import Comment from './comment.js'

export default class CommentLike extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => Comment)
  declare comment: BelongsTo<typeof Comment>

  @column()
  declare commentId: string

  @beforeCreate()
  static async incrementLikesCount(like: CommentLike) {
    await db.from('comments').where('id', like.commentId).increment('likes_count', 1)
  }

  @beforeDelete()
  static async decrementLikesCount(like: CommentLike) {
    await db.from('comments').where('id', like.commentId).increment('likes_count', -1)
  }
}
