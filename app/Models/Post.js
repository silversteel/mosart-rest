'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Post extends Model {
	users() {
		return this.belongsTo('App/Models/User', 'user_id', 'id')
	}

	favorites() {
		return this.belongsToMany('App/Models/User')
			.pivotTable('favorites')
	}

	comments() {
		return this.hasMany('App/Models/Comment')
	}

	profiles() {
		return this.manyThrough('App/Models/User', 'profiles', 'user_id', 'id')
	}

	follows() {
		return this.manyThrough('App/Models/User', 'following', 'user_id', 'id')
	}

	tags() {
		return this.belongsToMany('App/Models/Tag')
			.pivotTable('post_tags')
	}

}

module.exports = Post
