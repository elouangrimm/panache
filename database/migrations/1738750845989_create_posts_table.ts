import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.integer('likes_count').defaultTo('0')
      table.string('title').notNullable()
      table.string('link').nullable()
      table.string('text').nullable()
      table.string('image').nullable()
      table.string('og_image').nullable()
      table
        .string('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.string('room_id').references('id').inTable('rooms').onDelete('cascade')

      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
