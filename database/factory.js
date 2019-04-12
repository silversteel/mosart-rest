'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', async (faker) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: '123'
  }
})

Factory.blueprint('App/Models/Profile', async (faker, i, data) => {
  return {
		name: data[i].name,
		image_url: data[i].image_url,
		bio: data[i].bio,
		location: data[i].location,
		website: data[i].website
  }
})

Factory.blueprint('App/Models/Tag', async (faker, i, data) => {
  return {
  	label: data[i].label
  }
})

Factory.blueprint('App/Models/Post', async (faker, i, data) => {
  return {
  	user_id: data.user_id,
		title: data.title,
		image_url: data.image_url,
		description: data.description,
		views: data.views
  }
})