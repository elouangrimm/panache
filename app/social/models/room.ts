import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Post from './post.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'
import RoomMember from './room_member.js'

export default class Room extends BaseModel {
  /**
   * UUID primary key.
   */
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignId(model: Room) {
    model.id = string.slug(model.name, { lower: true, replacement: '-' })
  }

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare lang: string

  @column()
  declare membersCount: number

  /**
   * Relationships.
   */
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => RoomMember)
  declare members: HasMany<typeof RoomMember>

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
