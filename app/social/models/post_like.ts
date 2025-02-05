import { BaseModel, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#common/models/user'
import db from '@adonisjs/lucid/services/db'
import Post from './post.js'

export default class PostLike extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare postId: string

  @beforeCreate()
  static async incrementLikesCount(postLike: PostLike) {
    await db.from('posts').where('id', postLike.postId).increment('likes_count', 1)
  }

  @beforeDelete()
  static async decrementLikesCount(postLike: PostLike) {
    await db.from('posts').where('id', postLike.postId).increment('likes_count', -1)
  }
}
