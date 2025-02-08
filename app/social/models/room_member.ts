import { BaseModel, beforeCreate, beforeDelete, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Room from './room.js'
import db from '@adonisjs/lucid/services/db'
import Profile from './profile.js'

export default class RoomMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare role: 'moderator' | 'member'

  @belongsTo(() => Profile)
  declare profile: BelongsTo<typeof Profile>

  @column()
  declare profileId: string

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @column()
  declare roomId: string

  @beforeCreate()
  static async incrementRoomCount(roomMember: RoomMember) {
    await db.from('rooms').where('id', roomMember.roomId).increment('members_count', 1)
  }

  @beforeDelete()
  static async decrementRoomCount(roomMember: RoomMember) {
    await db.from('rooms').where('id', roomMember.roomId).increment('members_count', -1)
  }
}
