import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('profile_id').references('id').inTable('profiles').onDelete('cascade')
      table.string('room_id').references('id').inTable('rooms').onDelete('cascade')
      table.enum('role', ['moderator', 'member']).defaultTo('member')

      table.unique(['profile_id', 'room_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
