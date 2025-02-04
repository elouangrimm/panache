import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Room extends BaseModel {
  @column()
  declare name: string

  @column()
  declare slug: string
}
