import User from '#common/models/user'
import { afterCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Room from './room.js'
import BaseModel from '#common/models/base_model'
import PostLike from './post_like.js'
import PostCreated from '#social/events/post_created'

export default class Post extends BaseModel {
  @column()
  declare likesCount: number

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

  @afterCreate()
  static emitCreationEvent(post: Post) {
    PostCreated.dispatch(post)
  }
}
