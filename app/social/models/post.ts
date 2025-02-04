import User from '#common/models/user'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Room from './room.js'
import BaseModel from '#common/models/base_model'

export default class Post extends BaseModel {
  @column()
  declare title: string

  @column()
  declare url: string | null

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
}
