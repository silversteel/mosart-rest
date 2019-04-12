'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProfileSchema extends Schema {
  up () {
    this.create('profiles', (table) => {
      table.increments()
      table.integer('user_id', 10).unsigned().notNullable().references('id').inTable('users').onDelete('cascade').onUpdate('cascade')
      table.string('name', 128).notNullable()
      table.string('image_url', 255)
      table.string('bio', 110)
      table.string('location', 128)
      table.string('website', 128)
    })
  }

  down () {
    this.drop('profiles')
  }
}

module.exports = ProfileSchema
