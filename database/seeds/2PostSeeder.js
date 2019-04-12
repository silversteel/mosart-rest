'use strict'

/*
|--------------------------------------------------------------------------
| PostSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const { postData } = require('../dummyData')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Tag = use('App/Models/Tag')

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max))
}

class PostSeeder {
  async run () {
  	
    const users = await User.all()
  	const tags = await Tag.all()
  	const arrayUser = users.toJSON().map((item) => item.id)
  	const arrayTag = tags.toJSON().map((item) => item.id)

  	for(let [i, post] of postData.entries()) {
  		let tagList = []

  		for(let i=0; i < getRandomInt(5); i++){
  			tagList = [...tagList, arrayTag[getRandomInt(arrayTag.length)]]
  		}

  		const post = await Factory.model('App/Models/Post').create({ ...postData[i], user_id: arrayUser[getRandomInt(arrayUser.length)]})  		
  		await post.tags().attach(tagList)
  	}

  }
}

module.exports = PostSeeder
