'use strict'

/*
|--------------------------------------------------------------------------
| TagSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const { tagData } = require('../dummyData')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TagSeeder {
  async run () {
		const tags = await Factory.model('App/Models/Tag').createMany(tagData.length, tagData)
  }
}

module.exports = TagSeeder
