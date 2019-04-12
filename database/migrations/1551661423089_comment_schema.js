'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.integer('post_id', 10).unsigned().notNullable().references('id').inTable('posts').onDelete('cascade').onUpdate('cascade')
      table.integer('user_id', 10).unsigned().notNullable().references('id').inTable('users').onDelete('cascade').onUpdate('cascade')
      table.text('content').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
