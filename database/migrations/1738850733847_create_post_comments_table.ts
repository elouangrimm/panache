import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table
        .string('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('cascade')
        .onDelete('cascade')
      table
        .string('post_id')
        .references('id')
        .inTable('posts')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.string('text').notNullable()
      table.integer('likes_count').defaultTo('0')
      table.integer('comments_count').defaultTo('0')
      table.string('comment_id').references('id').inTable('post_comments').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
