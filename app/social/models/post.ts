import User from '#common/models/user'
import { afterCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Room from './room.js'
import BaseModel from '#common/models/base_model'
import PostLike from './post_like.js'
import PostCreated from '#social/events/post_created'
import PostComment from './post_comment.js'

export default class Post extends BaseModel {
  @column()
  declare title: string

  @column()
  declare link: string | null

  @column()
  declare text: string | null

  @column()
  declare image: string | null

  @column()
  declare ogImage: string | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @column()
  declare roomId: string

  @hasMany(() => PostLike)
  declare likes: HasMany<typeof PostLike>

  @column()
  declare likesCount: number

  @hasMany(() => PostComment)
  declare comments: HasMany<typeof PostComment>

  @column()
  declare commentsCount: number

  @afterCreate()
  static emitCreationEvent(post: Post) {
    PostCreated.dispatch(post)
  }
}
