'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.integer('user_id', 10).unsigned().notNullable().references('id').inTable('users')
      table.string('image_uri', 128).notNullable()
      table.string('title', 128).notNullable()
      table.string('description', 255)
      table.integer('views', 10).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
