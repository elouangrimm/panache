import User from '#common/models/user'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import BaseModel from '#common/models/base_model'
import Post from './post.js'

export default class Comment extends BaseModel {
  @column()
  declare text: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => Post)
  declare post: BelongsTo<typeof Post>

  @column()
  declare postId: string
}
