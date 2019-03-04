'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
	users() {
		return this.belongsTo('App/Models/User', 'user_id', 'id')
	}

	comments() {
		return this.hasMany('App/Models/Comment', 'id', 'post_id')
	}

	favorites() {
		return this.hasMany('App/Models/Favorite', 'id', 'post_id')
	}

	tags() {
		return this.hasMany('App/Models/Tag')
	}

	static getPosts() {
		return this.query()
		.select([
			'posts.id',
			'posts.title', 
			'posts.created_at', 
			'posts.image_uri', 
			'posts.views',
			'profiles.user_id',
			'profiles.name', 
			'profiles.profile_image'
			])
		.innerJoin('users', 'users.id', 'posts.user_id')
		.innerJoin('profiles', 'users.id', 'profiles.user_id')
		.fetch()
	}
}

module.exports = Post
