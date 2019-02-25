'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Profile = use('App/Models/Profile')

/**
 * Resourceful controller for interacting with profiles
 */
class ProfileController {

  /**
   * Display a single profile.
   * GET profiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const { id } = params
    try {
      const profile = await Profile.findOrFail(id)
      return profile
    } catch(e) {
      switch(e.code){
        case 'E_MISSING_DATABASE_ROW':
          return response.status(e.status).send({
            status: 'failed',
            message: 'Profil tidak ditemukan'
          }) 
          break
        default:
          return response.status(e.status).send({
            status: 'failed',
            message: e.message
          }) 
          break
      }
    }
  }

  /**
   * Update profile details.
   * PUT or PATCH profiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    const { id } = params
    const { name, bio, location, website } = request.post()
    try {
      const user = await auth.getUser()
      if(user.id != id){
        throw { message: 'you cant access another user!'}
      }
      const profile = await user.profiles().fetch()
      profile.name = name
      profile.bio = bio
      profile.location = location
      profile.website = website
      await profile.save()

      return profile
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

}

module.exports = ProfileController
