import { BaseModel, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#common/models/user'
import Room from './room.js'
import db from '@adonisjs/lucid/services/db'

export default class RoomMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare userId: string

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @column()
  declare roomId: string

  @beforeCreate()
  static async incrementRoomCount(roomMember: RoomMember) {
    await db.from('rooms').where('id', roomMember.roomId).increment('member_count', 1)
  }

  @beforeDelete()
  static async decrementRoomCount(roomMember: RoomMember) {
    await db.from('rooms').where('id', roomMember.roomId).increment('member_count', -1)
  }
}
