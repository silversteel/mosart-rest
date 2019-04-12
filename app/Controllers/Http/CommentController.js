'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Comment = use('App/Models/Comment')

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {

  /**
   * Create/save a new comment.
   * POST comments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    const { post_id, content } =  request.post() 
    try {
      const user = await auth.getUser()
      return await Comment.create({ user_id: user.id, post_id, content })
    } catch(e) {
      console.log(e.message)
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Display a single comment.
   * GET comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const { id } = params
    try {
      const comment = await Comment.findOrFail(id)
      const user = await comment.users().fetch()
      const profile = await user.profiles().setVisible(['name']).fetch()
      return {
        ...comment.toJSON(),
        profile
      }
    } catch(e) {
      console.log(e.message)
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    const { id } = params
    const { content } = request.post()
    try {
      await auth.check()
      const comment = await Comment.findOrFail(id)
      comment.content = content
      await comment.save()
      return comment
    } catch(e) {
      console.log(e.message)
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const { id } = params
    try {
      const comment = await Comment.findOrFail(id)
      await comment.delete()
      return comment
    } catch(e) {
      console.log(e.message)
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }
}

module.exports = CommentController
