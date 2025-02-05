import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Post from './post.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Room extends BaseModel {
  /**
   * UUID primary key.
   */
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignId(model: Room) {
    model.id = model.name.toLowerCase()
  }

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare lang: string

  @column()
  declare memberCount: number

  /**
   * Relationships.
   */
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  /**
   * Timestamps.
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
