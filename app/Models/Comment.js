'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Comment extends Model {

	users() {
		return this.belongsTo('App/Models/User', 'user_id', 'id')
	}

	profiles() {
		return this.manyThrough('App/Models/User', 'profiles', 'user_id', 'id')
	}

	static getCommentsByPost(post_id) {
		return this.query()
			.select([
				'comments.id', 
				'users.id as user_id',
				'profiles.profile_image', 
				'profiles.name as name', 
				'comments.content', 
				'comments.created_at', 
				'comments.updated_at'])
			.innerJoin('users', 'comments.user_id', 'users.id')
			.innerJoin('profiles', 'users.id', 'profiles.user_id')
			.where('post_id', post_id)
			.fetch()
	}
}

module.exports = Comment
