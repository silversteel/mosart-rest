'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Post = use('App/Models/Post')
const Comment = use('App/Models/Comment')
const Favorite = use('App/Models/Favorite')
const Follow = use('App/Models/Follow')

/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  /**
   * Show a list of all posts.
   * GET posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    try {
      const posts = await Post.query().with('users', (builder) => builder.setVisible(['']).with('profiles', (builder) => builder.setVisible(['user_id', 'name', 'profile_image']))).withCount('comments').withCount('favorites').fetch()
      return posts.toJSON()
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Create/save a new post.
   * POST posts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      return await user.posts().create(request.post())
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }

  /**
   * Display a single post.
   * GET posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {
    const { id } =  params
    const { user_id } = request.get()
    try {
      let isFavorite = [{total:0}]
      const post = await Post.findOrFail(id)
      const user = await post.users().fetch()
      const author = await user.profiles().setVisible(['name', 'profile_image']).fetch()
      const tags = await post.tags().fetch()
      const favorites = await Favorite.query().where('post_id', post.id).count('* as total')
      const comments = await Comment.getCommentsByPost(id)

      if (user_id) {
        isFavorite = await Favorite.query().where('post_id', post.id).where('user_id', user_id).count('* as total')
      }
      
      return {
        ...post.toJSON(),
        tags,
        author,
        comments,
        favorites: favorites[0].total,
        isFavorite: isFavorite[0].total
      }
    } catch(e) {
      return response.send({
        status: 'failed',
        message: e.message
      })
    }
  }

  async getFollowingPosts({ auth, request, response }) {
    try {
      const user = await auth.getUser()
      const follows = await Follow.query().setVisible(['']).with('users', (builder) => {
        builder.setVisible(['']).with('posts', (builder) => {
          builder.with('users', (builder) => {
            builder.setVisible(['']).with('profiles', (builder) => {
              builder.setVisible(['user_id', 'name', 'profile_image'])
            })
          }).withCount('comments').withCount('favorites')
        })
      }).where('user_follow_id', user.id).fetch()

      let posts = []
      const data = follows.toJSON()

      for(let i=0; i < data.length; i++) {
        posts.push(...data[i].users[0].posts)
      }

      return posts
    } catch(e){
      response.send({
        message: e.message
      })
    }
  }

  /**
   * Update post details.
   * PUT or PATCH posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ auth, params, request, response }) {
    const { id } =  params
    const { image_uri, title, description, views } = request.post()
    try {
      const user = await auth.getUser()
      const post = await Post.findOrFail(id)

      if(post.user_id != user.id) {
        throw { message: 'anda tidak diperbolehkan mengakses user lain!' }
      }

      post.image_uri = image_uri
      post.title = title
      post.description = description
      post.views = views
      await post.save()

      return post
    } catch(e) {
      switch(e.code){
        case 'E_MISSING_DATABASE_ROW':
          return response.status(e.status).send({
            status: 'failed',
            message: 'Post not found'
          })
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
   * Delete a post with id.
   * DELETE posts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ auth, params, request, response }) {
    const { id } =  params
    try {
      const user = await auth.getUser()
      const post = await Post.findOrFail(id)

      if(post.user_id != user.id) {
        throw { message: 'anda tidak diperbolehkan mengakses user lain!' }
      }

      await post.delete()

      return post
    } catch(e) {
      return response.status(e.status).send({
        status: 'failed',
        message: e.message
      })
    }
  }
}

module.exports = PostController
