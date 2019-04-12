'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Profile extends Model {

 	users() {
 		this.belongsTo('App/Models/User', 'user_id', 'id')
	}

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
  
}

module.exports = Profile
