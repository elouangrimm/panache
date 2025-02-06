import { beforeCreate, beforeDelete, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import BaseModel from '#common/models/base_model'
import User from '#common/models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Post from './post.js'
import db from '@adonisjs/lucid/services/db'

export default class PostComment extends BaseModel {
  @column()
  declare text: string

  @column()
  declare commentsCount: number

  @column()
  declare commentId: string | null

  @belongsTo(() => PostComment)
  declare comment: BelongsTo<typeof PostComment>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare postId: string

  @hasMany(() => PostComment, { foreignKey: 'commentId' })
  declare comments: HasMany<typeof PostComment>

  @beforeCreate()
  static async incrementCommentsCount(comment: PostComment) {
    if (comment.commentId) {
      await db.from('post_comments').where('id', comment.id).increment('comments_count', 1)
    }

    await db.from('posts').where('id', comment.postId).increment('comments_count', 1)
  }

  @beforeDelete()
  static async decrementCommentsCount(comment: PostComment) {
    if (comment.commentId) {
      await db.from('post_comments').where('id', comment.id).increment('comments_count', -1)
    }

    await db.from('posts').where('id', comment.postId).increment('comments_count', -1)
  }
}
