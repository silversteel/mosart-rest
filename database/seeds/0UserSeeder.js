'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const { profileData } = require('../dummyData')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

class UserSeeder {
  async run () {
				
			const users = await Factory.model('App/Models/User').createMany(5)
			const profile = await Factory.model('App/Models/Profile').makeMany(5, profileData)

			for(let [ i, user ] of users.entries()) {
				//console.log(await Hash.verify('123', user.password))
				await user.profiles().save(profile[i])
			}
		
  }
}

module.exports = UserSeeder
