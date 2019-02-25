'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProfilesSchema extends Schema {
  up () {
    this.table('profiles', (table) => {
      table.string('profile_image', 255)
    })
  }

  down () {
    this.table('profiles', (table) => {
      table.dropColumn('profile_image')
    })
  }
}

module.exports = ProfilesSchema
