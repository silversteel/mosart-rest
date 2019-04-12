'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowSchema extends Schema {
  up () {
    this.create('follows', (table) => {
      table.increments()
      table.integer('lead_user_id', 10).unsigned().notNullable().references('id').inTable('users').onDelete('cascade').onUpdate('cascade')
      table.integer('follow_user_id', 10).unsigned().notNullable().references('id').inTable('users').onDelete('cascade').onUpdate('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('follows')
  }
}

module.exports = FollowSchema
