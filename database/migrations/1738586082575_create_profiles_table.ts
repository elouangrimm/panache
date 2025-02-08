import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary().notNullable()
      table.string('user_id').notNullable().references('id').inTable('users').onDelete('cascade')
      table.string('username').notNullable()
      table.string('avatar').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.alterTable('users', (table) => {
      table.string('current_profile_id').references('id').inTable('profiles').onDelete('cascade')
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('current_profile_id')
    })

    this.schema.dropTable(this.tableName)
  }
}
