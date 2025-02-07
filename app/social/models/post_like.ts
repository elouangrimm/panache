import { BaseModel, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import db from '@adonisjs/lucid/services/db'
import Post from './post.js'
import Profile from './profile.js'

export default class PostLike extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  @column()
  declare profileId: string

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
