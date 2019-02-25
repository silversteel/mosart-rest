'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Tag = use('App/Models/Tag')
const Post = use('App/Models/Post')

/**
 * Resourceful controller for interacting with tags
 */
class TagController {

  async index ({ request, response }) {
    try {
      return await Tag.all()
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Create/save a new tag.
   * POST tags
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const tag = await Tag.create(request.post())
      return tag
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Display a single tag.
   * GET tags/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const { id } = params
    try {
      const tag = await Tag.findOrFail(id)
      return tag
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Update tag details.
   * PUT or PATCH tags/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    const { id } = params
    const { label } = request.post()
    try {
      await auth.check()
      const tag = await Tag.findOrFail(id)
      tag.label = label
      await tag.save()

      return tag
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Delete a tag with id.
   * DELETE tags/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const { id } = params
    try {
      const tag = await Tag.findOrFail(id)
      await tag.delete()

      return tag
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }
}

module.exports = TagController
