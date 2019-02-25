'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagSchema extends Schema {
  up () {
    this.create('tags', (table) => {
      table.increments()
      table.integer('post_id', 10).unsigned().notNullable().references('id').inTable('posts')
      table.integer('user_id', 10).unsigned().notNullable().references('id').inTable('users')
      table.string('label', 10).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('tags')
  }
}

module.exports = TagSchema
