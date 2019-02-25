'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Follow extends Model {

	static getFollowers(user_id) {
		return this.query()
			.select(['profiles.name', 'profiles.profile_image'])
			.innerJoin('users', 'follows.user_follow_id', 'users.id')
			.innerJoin('profiles', 'users.id', 'profiles.user_id')
			.where('user_lead_id', user_id)
			.fetch()
	}

	static getFollowing(user_id) {
		return this.query()
			.select(['profiles.name', 'profiles.profile_image'])
			.innerJoin('users', 'follows.user_lead_id', 'users.id')
			.innerJoin('profiles', 'users.id', 'profiles.user_id')
			.where('user_follow_id', user_id)
			.fetch()
	}

}

module.exports = Follow
