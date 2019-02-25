'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagSchema extends Schema {
  up () {
    this.table('tags', (table) => {
      table.integer('user_id', 10).unsigned().notNullable().alter()
    })
  }

  down () {
    this.table('tags', (table) => {
      table.integer('user_id', 10).unsigned().notNullable().references('id').inTable('users')
    })
  }
}

module.exports = TagSchema
