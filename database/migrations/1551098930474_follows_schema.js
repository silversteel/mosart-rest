'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowsSchema extends Schema {
  up () {
    this.create('follows', (table) => {
      table.increments()
      table.integer('user_id', 10).unsigned().references('id').inTable('users').onDelete('cascade')
      table.integer('user_follow_id', 10).unsigned().references('id').inTable('users').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('follows')
  }
}

module.exports = FollowsSchema
