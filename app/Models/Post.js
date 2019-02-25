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

	tags() {
		return this.hasMany('App/Models/Tag')
	}
}

module.exports = Post
