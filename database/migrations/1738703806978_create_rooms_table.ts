import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.raw('CREATE EXTENSION IF NOT EXISTS unaccent;')

    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('name').notNullable().unique()
      table.string('description').notNullable()
      table.string('lang').notNullable()
      table.integer('member_count').defaultTo('0')

      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.raw('DROP EXTENSION unaccent;')

    this.schema.dropTable(this.tableName)
  }
}
