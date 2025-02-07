import { beforeCreate, beforeDelete, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import BaseModel from '#common/models/base_model'
import User from '#common/models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import db from '@adonisjs/lucid/services/db'
import CommentLike from '#social/models/comment_like'

export default class Comment extends BaseModel {
  @column()
  declare text: string

  @column()
  declare likesCount: number

  @column()
  declare commentsCount: number

  @column()
  declare commentId: string | null

  @belongsTo(() => Comment)
  declare comment: BelongsTo<typeof Comment>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare postId: string

  @hasMany(() => CommentLike)
  declare likes: HasMany<typeof CommentLike>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @beforeCreate()
  static async incrementCommentsCount(comment: Comment) {
    if (comment.commentId) {
      await db.from('comments').where('id', comment.id).increment('comments_count', 1)
    }

    await db.from('posts').where('id', comment.postId).increment('comments_count', 1)
  }

  @beforeDelete()
  static async decrementCommentsCount(comment: Comment) {
    if (comment.commentId) {
      await db.from('comments').where('id', comment.id).increment('comments_count', -1)
    }

    const subcomments = await Comment.query().where('comment_id', comment.id)
    await db
      .from('posts')
      .where('id', comment.postId)
      .increment('comments_count', -1 + -subcomments.length)
  }
}
